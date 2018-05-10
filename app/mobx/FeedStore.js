import { observable, computed } from 'mobx';
import firebase from 'react-native-firebase';
import UserStore from './UserStore.js';
import moment from 'moment';

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
      .on('value', (quests) => {
        if (quests) {
          this.quests = []
          quests.forEach(q => {
            var quest = q.val()
            quest._id =  q.key
            var upvotes = []
            var downvotes = []
            var solutions = []

            if(quest.solution) {
              Object.keys(quest.solution).forEach(s => {
                solutions.push(s)
              })
            }

            if(quest.upvote) {
              Object.keys(quest.upvote).forEach(u => {
                upvotes.push(u)
              })
            }

            if(quest.downvote) {
              Object.keys(quest.downvote).forEach(d => {
                downvotes.push(d)
              })
            }

            quest.solution = solutions
            quest.upvote = upvotes
            quest.downvote = downvotes

            this.quests.push(quest)
          })
          this.loading = false
        }
      })
    }
    this.loading = false
  }

  voteNotification = (quest, liked) => {
    let n = {
      description: UserStore.user.username + (liked ? " upvoted" : " downvoted") +  " your post.",
      date_created: moment().format(),
      user_id: quest.user_id,
      quest_id: quest._id,
    }
    
    const newQuestKey = firebase.database().ref().child('notification').push().key
    n._id = newQuestKey

    const updates = {}
    updates[`/notification/${n._id}`] = n

    firebase.database()
      .ref()
      .update(updates)
      .then(() => {
        this.loading = false
        this.error = ""
      })
      .catch(error => {
        this.loading = false
        this.error = error.message
      })
  }

  upvoteQuest = (quest) => {
    if (quest.downvote && quest.downvote.includes(UserStore.user.id)) {
      const updates = {}
      updates[`/quest/${quest._id}/downvote/${UserStore.user.id}`] = null
      updates[`/quest/${quest._id}/votes`] = quest.votes + 1
      
      quest.downvote = quest.downvote.filter(function(user) {
        return user != UserStore.user.id;
      });
      
      firebase.database()
        .ref()
        .update(updates)
        .then(() => {
          this.loading = false
          this.error = ""
          quest.votes += 1
          this.voteNotification(quest, true)
        })
        .catch((error) => {
          this.loading = false
          this.error = error.message
        })
    }
    else if(!(quest.upvote.includes(UserStore.user.id))) {
      const updates = {}
      updates[`/quest/${quest._id}/upvote/${UserStore.user.id}`] = true
      updates[`/quest/${quest._id}/votes`] = quest.votes + 1
      quest.upvote.push(UserStore.user.id)
      
      firebase.database()
        .ref()
        .update(updates)
        .then(() => {
          this.loading = false
          this.error = ""
          quest.votes += 1
          this.voteNotification(quest, true)
          
        })
        .catch((error) => {
          this.loading = false
          this.error = error.message
        })
    }
  }

  downvoteQuest = (quest) => {

    if (quest.upvote && quest.upvote.includes(UserStore.user.id)) {
      const updates = {}
      updates[`/quest/${quest._id}/upvote/${UserStore.user.id}`] = null
      updates[`/quest/${quest._id}/votes`] = quest.votes - 1

      quest.upvote = quest.upvote.filter(function(user) {
        return user != UserStore.user.id;
      });

      firebase.database()
        .ref()
        .update(updates)
        .then(() => {
          this.loading = false
          this.error = ""
          quest.votes -= 1
          this.voteNotification(quest, false)
        })
        .catch((error) => {
          this.loading = false
          this.error = error.message
        })
    }
    else if(!(quest.downvote.includes(UserStore.user.id))) {
      const updates = {}
      updates[`/quest/${quest._id}/downvote/${UserStore.user.id}`] = true
      updates[`/quest/${quest._id}/votes`] = quest.votes - 1

      quest.downvote.push(UserStore.user.id)
      
      firebase.database()
        .ref()
        .update(updates)
        .then(() => {
          this.loading = false
          this.error = ""
          quest.votes -= 1
          this.voteNotification(quest, false)
        })
        .catch((error) => {
          this.loading = false
          this.error = error.message
        })
    }
  }

  removeQuest = quest => {
    for(let i = 0; i < quests.length; i++) {
      if(quests[i]._id == quest._id) {
        quests.splice(i, 1)
      }
    }
  }
}

export default new FeedStore();