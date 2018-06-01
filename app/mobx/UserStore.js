import { observable, computed } from 'mobx';
import firebase from 'react-native-firebase';
import FeedStore from './FeedStore.js';
import { ToastAndroid } from 'react-native';

class UserStore {
  @observable
  user = {}

  @observable
  loading = false

  @observable
  error = ""

  @computed
  get fullName(): string {
    return `${this.user.first_name} ${this.user.middle_name.charAt(0)}. ${this.user.last_name}`
  }

  @observable
  ranks = [
    "Beginner", "Intermediate", "Genius", "Prodigy", "Ace", "Beast", "Champion", "Master", "Grandmaster", "Legendary Grandmaster"
  ]

  checkUser = (navigation) => {
    this.loading = true

    firebase.auth()
      .onAuthStateChanged((user) => {
      if (user) {
        this.initUser(user, navigation)
      }
      this.loading = false
    })
  }

  initUser = (user, navigation) => {
    firebase.database()
      .ref('/user')
      .orderByChild('email')
      .equalTo(user.email)
      .on('child_added', _user => {
        if (_user.val() != null) {
          this.user = _user.val()
          var reps = []
          var sols = []
          var todos = []

          for(var propt in this.user.todos) {
            var todo = this.user.todos[propt]
            todos.push(todo)
          }

          todos.sort(function(a,b) {return (a.date_created > b.date_created) ? 1 : ((b.date_created > a.date_created) ? -1 : 0);} ); 
          this.user.todos = todos

          // maybe can be optimize by not using firebase (see todos)
          firebase.database()
            .ref(`/user/${_user.key}/reply`)
            .once('value', (replies) => {
              if (replies) {
                replies.forEach(r => {
                  var reply = r.key
                  reps.push(reply)
                })
                this.user.reply = reps
              }
              firebase.database()
                .ref(`/user/${_user.key}/solution`)
                .once('value', (solutions) => {
                  if (solutions) {
                    solutions.forEach(s => {
                      var solution = s.key
                      sols.push(solution)
                    })
                    this.user.solution = sols
                    this.loading = false
                    navigation.navigate('Tab')
                  }
                })
            })
        }
      })
  }

  postQuest = (navigation, quest) => {
    this.loading = true; 

    let q = quest

    const newQuestKey = firebase.database().ref().child('quest').push().key
    q._id = newQuestKey

    const updates = {}

    updates[`/quest/${q._id}`] = q
    updates[`/user/${this.user._id}/experience`] = this.user.experience + 30
    this.user.experience += 30
    
    // exp
    var did_level_up = false
    if(this.user.experience >= this.user.level_exp) {
      updates[`/user/${this.user._id}/level`] = this.user.level + 1
      this.user.level += 1
      updates[`/user/${this.user._id}/level_exp`] = (2 * this.user.level_exp) + Math.round(this.user.level_exp * 0.10)
      this.user.level_exp += this.user.level_exp + Math.round(this.user.level_exp * 0.10)
      did_level_up = true
    }

    //todo
    var index = this.inTodo("Question")
    if(index != -1) {
      this.user.todos[this.user.current_todo - 1].requirements[index].current += 1
      updates[`/user/${this.user._id}/todos/${this.user.todos[this.user.current_todo - 1]._id}/requirements/${index}/current`] = this.user.todos[this.user.current_todo - 1].requirements[index].current 
      
      if(this.isDone(this.user.todos[this.user.current_todo - 1])) {
        this.user.current_todo += 1
        updates[`/user/${this.user._id}/current_todo`] = this.user.current_todo
      }
    }

    firebase.database()
      .ref()
      .update(updates)
      .then(() => {
        this.loading = false;
        this.error = "";
        this.title = ""
        this.description = ""
        navigation.navigate('Tab');
        ToastAndroid.show('Quest posted successfully!', ToastAndroid.SHORT);
        ToastAndroid.show('30 experience gained!', ToastAndroid.SHORT);
        if(did_level_up) {
          ToastAndroid.show('Level Up!', ToastAndroid.SHORT);
          did_level_up = false
        }
      })
      .catch((error) => {
        this.loading = false;
        this.error = error.message;
        this.title = ""
        this.description = ""
      })
  }

  inTodo = (question) => {
    if(this.user.current_todo > 5) {
      return -1
    }
    
    var requirements = this.user.todos[this.user.current_todo - 1].requirements
    for(var i = 0; i < requirements.length; i++) {
      if(requirements[i].requirement == question) {
        return i
      }
    }

    return -1
  } 

  isDone = (todo) => {
    for(var i = 0; i < todo.requirements.length; i++) {
      if(todo.requirements[i].current < todo.requirements[i].no) {
        return false
      }
    }

    return true
  }

  logOut = (navigation) => {
    firebase.auth()
      .signOut()
      .then(() => {
        this.user = {}
        navigation.navigate('Login')
      })
  }
}

export default new UserStore();