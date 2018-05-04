import { observable, computed } from 'mobx';
import firebase from 'react-native-firebase';
import UserStore from './UserStore.js';

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

  upvoteQuest = (quest) => {
    const updates = {}
    updates[`/quest/${quest._id}/upvote/${UserStore.user.id}`] = true
    updates[`/quest/${quest._id}/votes`] = quest.votes + 1

    firebase.database()
      .ref()
      .update(updates)
      .then(() => {
        this.loading = false
        this.error = ""
        quest.votes += 1
      })
      .catch((error) => {
        this.loading = false
        this.error = error.message
      })
  }

  downvoteQuest = (quest) => {
    const updates = {}
    updates[`/quest/${quest._id}/downvote/${UserStore.user.id}`] = true
    updates[`/quest/${quest._id}/votes`] = quest.votes - 1

    firebase.database()
      .ref()
      .update(updates)
      .then(() => {
        this.loading = false
        this.error = ""
        quest.votes -= 1
      })
      .catch((error) => {
        this.loading = false
        this.error = error.message
      })
  }
}

export default new FeedStore();