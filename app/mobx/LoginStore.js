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

class LoginStore {
  @observable
  loading = false

  @observable
  error = ""

  emailLogin = (navigation, user) => {
    firebase.auth().signInWithEmailAndPassword(user.email_username, user.password)
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
                  firebase.auth().signInWithEmailAndPassword(this.user.email, user.password)
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
}

export default new LoginStore();