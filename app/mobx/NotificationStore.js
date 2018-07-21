import { observable, computed } from 'mobx';
import firebase from 'react-native-firebase';
import UserStore from './UserStore.js';
import QuestStore from './QuestStore.js';
import FeedStore from './FeedStore.js';

class NotificationStore {
  @observable
  loading = false

  @observable
  error = ""

  @observable
  notifications = []

  @observable
  new_notif = false

  inList = (n_id) => {
    this.notifications.forEach(notification => {
      if(notification._id == n_id){
        return true
      }
    })
    return false
  }

  initNotifications = () => {
    this.notifications = []
    firebase.database()
      .ref('notification/').orderByChild("user_id").equalTo(UserStore.user._id)
      .on('child_added', n => {
        // notifications.forEach(n => {
          var notification = n.val()
          notification._id = n.key

          if(!this.inList(notification._id)) {
            this.new_notif = true
            this.notifications.unshift(notification)
          }
        // })
      })
  }

  hasUnreadNotif = () => {
    for(var i = 0; i < this.notifications.length; i++) {
      if(!this.notifications[i].is_read) {
        console.error(this.notifications[i])
        return true
      }
    }
    return false
  }

  getQuest = (notif, navigation) => {
    FeedStore.quests.forEach(quest => {
      if(quest._id === notif.quest_id) {
        if(notif.is_read == false) {
          notif.is_read = true
          const updates = {}
          updates[`${notif._id}/is_read`] = true
          firebase.database()
            .ref('/notification')
            .update(updates)
            .then(() => {
              QuestStore.setCurrentQuest(quest, navigation);
            })
        } else {
          QuestStore.setCurrentQuest(quest, navigation);
        }
      }
    })
  }

}

export default new NotificationStore();