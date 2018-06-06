import { observable, computed } from 'mobx';
import firebase from 'react-native-firebase';
import UserStore from './UserStore.js';
import QuestStore from './QuestStore.js';
import FeedStore from './FeedStore.js';

class RankingStore {
  @observable
  loading = false

  @observable
  error = ""

  @observable
  users = []

  initRanking = () => {
    this.loading = true
    this.users = []
    firebase.database()
      .ref('user/')
      .orderByChild('points')
      .on('value', users => {
        this.users = []
        users.forEach(n => {
          var user = n.val()
          user._id = n.key
          this.users.unshift(user)
        })
        this.loading = false
      })
  }

  getQuest = (quest_id, navigation) => {
    FeedStore.quests.forEach(quest => {
      if(quest._id === quest_id) {
        QuestStore.setCurrentQuest(quest, navigation);
      }
    })
  }

  sortRanking = (category) => {
    this.users = []
    firebase.database()
      .ref('user/')
      .orderByChild(category)
      .on('value', users => {
        users.forEach(n => {
          var user = n.val()
          user._id = n.key
          if(!this.inList(user._id)) {
            this.users.unshift(user)
          }
        })
      })
  }

}

export default new RankingStore();