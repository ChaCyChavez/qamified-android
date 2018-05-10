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
      .on('value', notifications => {
        notifications.forEach(n => {
          var notification = n.val()
          notification._id = n.key

          if(!this.inList(notification._id)) {
            this.notifications.unshift(notification)
          }
        })
      })
  }

  getQuest = (quest_id, navigation) => {
    FeedStore.quests.forEach(quest => {
      if(quest._id === quest_id) {
        QuestStore.setCurrentQuest(quest, navigation);
      }
    })
  }

}

export default new NotificationStore();