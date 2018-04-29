import { observable, computed } from 'mobx';
import firebase from 'react-native-firebase';

class FeedStore {
  @observable
  loading = false

  @observable
  error = ""

  @observable
  current_quest = {}

  @observable
  quests = []

  initFeed = () => {
    this.loading = true
    if (this.quests.length == 0) {
      firebase.database()
      .ref('/quest')
      .once('value', (quests) => {
        if (quests) {
          quests.forEach(p => {
            var quest = p.val()
            this.quests.push(quest)
          })
          this.loading = false
        }
      })
    }
    
  }
}

export default new FeedStore();