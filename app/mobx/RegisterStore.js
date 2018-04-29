import { observable, computed } from 'mobx';
import firebase from 'react-native-firebase';
import UserStore from './UserStore.js';   

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

class RegisterStore {
  @observable
  loading = false

  @observable
  error = ""

  // insertNewUser = (navigation, username, uid) => {
  //   var json = JSON.parse('{' + '"' + username + '"' + ':"' + uid + '"}')
  //   firebase.database()
  //     .ref('usernames').update(json)
  //     .then((data) => {
  //       this.loading = false;
  //       this.error = "Done!"
  //       navigation.navigate('Tab');
  //     })
  //     .catch((error) => {
  //       this.loading = false;
  //       this.error = error.message;
  //     });
  // }

  register = (navigation, user, password) => {
    this.loading = true;
    firebase.database()
      .ref('/user')
      .child(user.username)
      .once('value', (snapshot) => {
        if(snapshot.val() === null) {
          firebase.auth().createUserAndRetrieveDataWithEmailAndPassword(user.email, password)
            .then((_user) => {
              firebase.database()
                .ref('user').child(_user.user.uid).set(user)
                .then(() => {
                  this.loading = false;
                  this.error = ""
                  UserStore.user = user
                  UserStore.user.id = _user.user.uid
                  navigation.navigate('Tab');
                })
                .catch((error) => {
                  this.loading = false;
                  this.error = error.message;
                });
            })
            .catch((error) => {
              this.loading = false;
              this.error = error.message;
            });
        }
        else {
          this.loading = false;
          this.error = "Username already exists";
        }
      })
  }
}

export default new RegisterStore();