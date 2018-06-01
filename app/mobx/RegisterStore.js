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
  
  register = (navigation, user, password) => {
    this.loading = true;
    firebase.database()
      .ref('/user')
      .child(user.username)
      .once('value', (snapshot) => {
        if(snapshot.val() === null) {
          firebase.auth().createUserAndRetrieveDataWithEmailAndPassword(user.email, password)
            .then((_user) => {
              user._id = _user.user.uid

              firebase.database()
              .ref('/todo')
              .once('value', todos => {
                user.todos = todos
                const updates = {}
                updates[`user/${user._id}`] = user

                firebase.database()
                  .ref()
                  .update(updates)
                  .then(() => {
                    this.error = ""
                    this.loading = false
                    UserStore.initUser(user, navigation)
                  })
                  .catch(error => {
                    this.error = error.message
                    this.loading = false
                  })
              })
              
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