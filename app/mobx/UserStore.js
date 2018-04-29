import { observable, computed } from 'mobx';
import firebase from 'react-native-firebase';
import FeedStore from './FeedStore.js';

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

class UserStore {
  @observable
  user = {}

  @observable
  loading = false

  @observable
  error = ""

  @observable
  title = ""

  @observable
  description = ""

  @computed
  get fullName(): string {

    return "{0} {1}. {2}".format(this.user.first_name, this.user.middle_name.charAt(0), this.user.last_name);
  }

  isLoggedIn = (navigation) => {
    this.loading = true

    firebase.auth()
      .onAuthStateChanged((user) => {
      if (user) {
        firebase.database()
          .ref('/user')
          .orderByChild('email')
          .equalTo(user.email)
          .limitToFirst(1)
          .on('child_added', _user => {
            if (_user.val() != null) {
              this.user = _user.val()
              this.loading = false
              navigation.navigate('Tab')
            }
          })
      }
      this.loading = false
    })
  }

  postQuest = (navigation, quest) => {
    this.loading = true; 

    let q = quest

    const newQuestKey = firebase.database().ref().child('quest').push().key
    q._id = newQuestKey

    const updates = {}

    updates[`/quest/${q._id}`] = q

    firebase.database()
      .ref()
      .update(updates)
      .then(() => {
        this.loading = false;
        this.error = "";
        this.title = ""
        this.description = ""
        FeedStore.quests.push(q)
        navigation.navigate('Tab');
      })
      .catch((error) => {
        this.loading = false;
        this.error = error.message;
        this.title = ""
        this.description = ""
      })
  };

  logOut = (navigation) => {
    firebase.auth()
      .signOut()
    this.user = {}
    navigation.navigate('Login')
  }
}

export default new UserStore();