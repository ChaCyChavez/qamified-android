import { observable, computed } from 'mobx';
import firebase from 'react-native-firebase';
import UserStore from './UserStore.js';

class LoginStore {
  @observable
  loading = false

  @observable
  error = ""

  emailLogin = (navigation, cred) => {
    firebase.auth()
      .signInWithEmailAndPassword(cred.email_username, cred.password)
      .then(() => {
        firebase.database()
          .ref('/user')
          .orderByChild('email')
          .equalTo(user.email_username)
          .limitToFirst(1)
          .on('child_added', (user) => {
            if (user) {
              UserStore.user = user
            }
          })
        this.loading = false;
        this.error = ""
        navigation.navigate('Tab');
      })
      .catch((error) => {
        this.loading = false;
        this.error = "Login failed"
      })
  }

  usernameLogin = (navigation, cred) => {
    firebase.database()
      .ref('/user')
      .orderByChild('username')
      .equalTo(cred.email_username)
      .limitToFirst(1)
      .on('child_added', user => {
        if(user.val() !== null) {
          UserStore.user = user.val()
          UserStore.user.id = user.key
          firebase.auth()
            .signInAndRetrieveDataWithEmailAndPassword(UserStore.user.email, cred.password)
            .then(() => {
              this.loading = false;
              this.error = ""
              navigation.navigate('Tab');
            })
            .catch((error) => {
              UserStore.user = {}
              this.loading = false;
              this.error = error.message
            })
        } 
        else {
          this.loading = false;
          this.error = "Invalid email or username"
        }
      })
  }

  login = (navigation, user) => {
    console.log('Login')
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