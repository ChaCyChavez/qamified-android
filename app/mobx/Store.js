import { observable, computed } from 'mobx';
import firebase from 'react-native-firebase';

// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

class Store {
  @observable user = {};

  @observable loginState = {
    loading: false,
    error: "",
  }

  @observable registerState = {
    loading: false,
    error: "",
  }

  @observable createQuestState = {
    loading: false,
    error: "",
  }

  @observable questState = {
    loading: false,
    error: "",
    current_quest: {},
    replies: [],
  }

  @observable feedState = {
    loading: false,
    error: "",
    posts: [],
  }

  @computed get fullName(): string {
    return "{0} {1}. {2}".format(this.user.first_name, this.user.middle_name.charAt(0), this.user.last_name);
  }

  emailLogin = (navigation, user) => {
    firebase.auth().signInAndRetrieveDataWithEmailAndPassword(user.email_username, user.password)
      .then(() => {
        firebase.database()
          .ref('usernames')
          .child(user.email_username)
          .once('value', (snapshot) => {
            if(snapshot.val() !== null) {
              var uid = snapshot.val()
              firebase.database()
                .ref('users')
                .child(uid)
                .once('value', (snapshot) => {
                  if(snapshot.val() !== null) {
                    this.user = snapshot.val()
                  }
                })
            }
          })
        this.loginState.loading = false;
        this.loginState.error = ""
        navigation.navigate('Tab');
      })
      .catch((error) => {
        this.loginState.loading = false;
        this.loginState.error = "Login failed"
      })
  }

  usernameLogin = (navigation, user) => {
    firebase.database()
        .ref('usernames')
        .child(user.email_username)
        .once('value', (snapshot) => {
          if(snapshot.val() !== null) {
            var uid = snapshot.val()
            firebase.database()
              .ref('users')
              .child(uid)
              .once('value', (snapshot) => {
                if(snapshot.val() !== null) {
                  this.user = snapshot.val();
                  this.user.id = snapshot.key;
                  firebase.auth().signInAndRetrieveDataWithEmailAndPassword(this.user.email, user.password)
                    .then(() => {
                      this.loginState.loading = false;
                      this.loginState.error = ""
                      navigation.navigate('Tab');
                    })
                    .catch((error) => {
                      this.user = {}
                      this.loginState.loading = false;
                      this.loginState.error = error.message
                    })
                }
                else {
                  this.loginState.loading = false;
                  this.loginState.error = "Invalid email or username" 
                }
              })
          } 
          else {
            this.loginState.loading = false;
            this.loginState.error = "Invalid email or username"
          }
        })
  }

  login = (navigation, user) => {
    this.loginState.loading = true;
    this.loginState.error = ""

    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if(regex.test(user.email_username)){
      this.emailLogin(navigation, user);
    }
    else {
      this.usernameLogin(navigation, user);
    }
  }

  insertNewUser = (navigation, username, uid) => {
    var json = JSON.parse('{' + '"' + username + '"' + ':"' + uid + '"}')
    firebase.database()
      .ref('usernames').update(json)
      .then((data) => {
        this.registerState.loading = false;
        this.registerState.error = "Done!"
        navigation.navigate('Tab');
      })
      .catch((error) => {
        this.registerState.loading = false;
        this.registerState.error = error.message;
      });
  }

  register = (navigation, user) => {
    this.registerState.loading = true;
    this.user = {
      first_name: user.first_name,
      middle_name: user.mid_name,
      last_name: user.last_name,
      institution: user.institution,
      email: user.email,
      username: user.username,
      description: "",
      achievements: [],
      points: 0,
      experience: 0,
      level: 1,
      rank: "Beginner",
    }

    firebase.database()
      .ref('usernames')
      .child(user.username)
      .once('value', (snapshot) => {
        if(snapshot.val() === null) {
          firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
            .then((_user) => {
              firebase.database()
                .ref('users').child(_user.uid).set(this.user)
                .then(() => {
                  this.insertNewUser(navigation, user.username, _user.uid);
                })
                .catch((error) => {
                  this.registerState.loading = false;
                  this.registerState.error = error.message;
                });
            })
            .catch((error) => {
              this.registerState.loading = false;
              this.registerState.error = error.message;
            });
        }
        else {
          this.registerState.loading = false;
          this.registerState.error = "Username already exists";
        }
      })
  }

  postQuest = (navigation, quest) => {
    this.createQuestState.loading = true;
    var currDate = new Date();
    this.quest = {
      date_created: currDate.getTime(),
      title: quest.title,
      description: quest.description,
      votes: 0,
      user_id: this.user.id,
      is_answered: false,
      username: this.user.username,
      full_name: "{0} {1}. {2}".format(this.user.first_name, this.user.middle_name.charAt(0), this.user.last_name),
      solutions: {},
    }

    firebase.database()
      .ref('posts').push().set(this.quest)
      .then(() => {
        this.createQuestState.loading = false;
        this.createQuestState.error = "";
        navigation.navigate('Tab');
      })
      .catch((error) => {
        this.createQuestState.loading = false;
        this.createQuestState.error = error.message;
      })
  }


  setCurrentQuest = (quest, navigation) => {
    this.questState.current_quest = quest;

    var solutions = []
    this.questState.current_quest.solutions.forEach((sol) => {
      var replies = []
      for(var rep in sol["reply"]) {
        var reply = sol["reply"][rep]
        reply.id = rep
        replies.push(reply)
      }
      sol["reply"] = replies
    })
    
    navigation.navigate("Quest")
  };

  initFeed = () => {
    firebase.database()
      .ref('posts')
      .on('value', (posts) => {
        if(posts.val() !== null) {
          posts.forEach((p) => {
            var quest = p.val()
            quest.id = p.key

            firebase.database()
              .ref('posts/' + quest.id + "/solutions")
              .on('value', (solutions) => {
                if(solutions.val() !== null) {
                  quest.solutions = []
                  solutions.forEach((s) => {
                    var solution = s.val()
                    solution.id = s.key
                    quest.solutions.push(solution)
                  })
                  this.feedState.posts.push(quest)
                }
              })
          })
        }
      })
  }

}

export default new Store();