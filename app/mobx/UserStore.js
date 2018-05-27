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

  isLoggedIn = (navigation) => {
    this.loading = true

    firebase.auth()
      .onAuthStateChanged((user) => {
      if (user) {
        firebase.database()
          .ref('/user')
          .orderByChild('email')
          .equalTo(user.email)
          .on('child_added', _user => {
            if (_user.val() != null) {
              this.user = _user.val()
              var reps = []
              var sols = []
              firebase.database()
                .ref(`/user/${_user.key}/reply`)
                .once('value', (replies) => {
                  if (replies) {
                    replies.forEach(r => {
                      var reply = r.key
                      reps.push(reply)
                    })
                    this.user.reply = reps
                    this.loading = false
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
    updates[`/user/${this.user._id}/experience`] = this.user.experience + 30
    this.user.experience += 30
    var did_level_up = false
    if(this.user.experience >= this.user.level_exp) {
      updates[`/user/${this.user._id}/level`] = this.user.level + 1
      this.user.level += 
      updates[`/user/${this.user._id}/level_exp`] = (2 * this.user.level_exp) + Math.round(this.user.level_exp * 0.10)
      this.user.level_exp += this.user.level_exp + Math.round(this.user.level_exp * 0.10)
      did_level_up = true
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
  };

  logOut = (navigation) => {
    firebase.auth()
      .signOut()
    this.user = {}
    navigation.navigate('Login')
  }
}

export default new UserStore();