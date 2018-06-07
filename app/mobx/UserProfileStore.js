import { observable, computed } from 'mobx';
import firebase from 'react-native-firebase';
import UserStore from './UserStore';
import FeedStore from './FeedStore';
import { ToastAndroid } from 'react-native';

class UserProfileStore {
  @observable
  current_user = {}

  @observable
  loading = false

  @observable
  profileFeed = []

  @observable
  open = false

  @computed
  get fullName(): string {
    return `${this.current_user.first_name} ${this.current_user.middle_name.charAt(0)}. ${this.current_user.last_name}`
  }

  setUser = (user_id, navigation) => {
    firebase.database()
      .ref('user/')
      .orderByChild('_id').equalTo(user_id)
      .once('child_added', user => {
        this.current_user = user.val()
        var reps = []
        var sols = []
        firebase.database()
          .ref(`/user/${user_id}/reply`)
          .once('value', (replies) => {
            if (replies) {
              replies.forEach(r => {
                var reply = r.key
                reps.push(reply)
              })
              this.current_user.reply = reps
              this.loading = false
            }
            firebase.database()
              .ref(`/user/${user_id}/solution`)
              .once('value', (solutions) => {
                if (solutions) {
                  solutions.forEach(s => {
                    var solution = s.key
                    sols.push(solution)
                  })
                  this.current_user.solution = sols
                  this.loading = false
                  navigation.navigate('UserProfile')
                }
              })
          })
      })
  }

  alreadyExist = (id) => {

    this.profileFeed.forEach(quest => {
      if(quest._id == id) {
        return true
      }
    })
    return false
  }

  initProfileFeed = () => {
    this.loading = true
    this.profileFeed = []
    
    FeedStore.quests.forEach(quest => {
      if(quest.user_id == this.current_user._id) {
        if(!this.alreadyExist(quest.id)) {
          this.profileFeed.unshift(quest)
        }
      }
    })

    this.current_user.solution.forEach(s_id => {
      FeedStore.quests.forEach(quest => {
        if(quest.solution.includes(s_id)) {
          if(!this.alreadyExist(quest.id)) {
            this.profileFeed.unshift(quest)
          }
        }
      })
    })
    setTimeout(() => {this.loading = false}, 2000)
  }

  reportUser = (r) => {
    const updates = {}
    firebase.database()
      .ref('user').child(`${this.current_user._id}`)
      .transaction(user => {
        if(user.report) {
          user.report.push({
            report: r,
            user_id: UserStore.user._id
          })
        } else {
          var report = [{
            report: r,
            user_id: UserStore.user._id
          }]

          user.report = report
        }
        return user
      })
    ToastAndroid.show("Successfully reported", ToastAndroid.SHORT)
  }
}

export default new UserProfileStore();
