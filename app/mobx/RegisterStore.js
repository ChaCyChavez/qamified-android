import { observable, computed } from 'mobx';
import firebase from '../firebase/firebase.js';

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

class LoginStore {
  @observable
  loading = false

  @observable
  error = ""

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
}

export default new RegisterStore();