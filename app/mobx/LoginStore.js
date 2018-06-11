import { observable, computed } from 'mobx';
import firebase from 'react-native-firebase';
import UserStore from './UserStore.js';

class LoginStore {
  @observable
  loading = false

  @observable
  error = ""

  isEmpty = (obj) => {
    for(var prop in obj) {
      if(obj.hasOwnProperty(prop))
        return false;
    }

    return JSON.stringify(obj) === JSON.stringify({})
  }

  emailLogin = (navigation, cred) => {
    firebase.auth()
      .signInAndRetrieveDataWithEmailAndPassword(cred.email_username, cred.password)
      .then(() => {
        firebase.database()
          .ref('/user')
          .orderByChild('email')
          .equalTo(cred.email_username)
          .limitToFirst(1)
          .once('value', user => {

            user.forEach(u => {
              UserStore.user = u.val()
            })

            if (!this.isEmpty(UserStore.user)) {
              UserStore.user = user
              if (!UserStore.user.is_banned) {
                this.loading = false;
                this.error = ""
                UserStore.initUser(user, navigation)
              } else {
                this.loading = false;
                this.error = "You have been banned in this application for reason of either of the following: False information, Trolling or Spamming."
              }
            }
            else {
              this.loading = false
              this.error = "Your account was deleted, please contact administrator."
            }
          })
        
      })
      .catch((error) => {
        this.loading = false;
        this.error = error.message
      })
  }

  usernameLogin = (navigation, cred) => {
    firebase.database()
      .ref('/user')
      .orderByChild('username')
      .equalTo(cred.email_username)
      .limitToFirst(1)
      .once('value', user => {
        
        user.forEach(u => {
          UserStore.user = u.val()
        })

        if(!this.isEmpty(UserStore.user)) {
          if (!UserStore.user.is_banned) {
            firebase.auth()
              .signInAndRetrieveDataWithEmailAndPassword(UserStore.user.email, cred.password)
              .then((user) => {
                this.loading = false;
                this.error = ""
                UserStore.initUser(user, navigation)
              })
              .catch((error) => {
                UserStore.user = {}
                this.loading = false;
                this.error = error.message
              })
          } else {
            UserStore.user = {}
            this.loading = false
            this.error = "You have been banned in this application for reason of either of the following: False information, Trolling or Spamming."
          }
        } 
        else {
          this.loading = false;
          this.error = "Invalid email or username"
        }
      })
  }

  login = (navigation, user) => {
    this.loading = true;
    this.error = ""

    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if(regex.test(user.email_username)){
      this.emailLogin(navigation, user);
    }
    else {
      this.usernameLogin(navigation, user);
    }
  }
}

export default new LoginStore();