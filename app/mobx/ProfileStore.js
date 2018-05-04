import { observable, computed } from 'mobx';
import firebase from 'react-native-firebase';
import UserStore from './UserStore';

class ProfileStore {
  @observable
  loading = false

  @observable
  editing = false

  @observable
  profileFeed = []

  alreadyExist(id) {
    for(var i = 0; i < this.profileFeed.length; i++) {
      if (this.profileFeed[i].id == id) {
        return true 
      }
    }
    return false
  }

  initProfileFeed = () => {
    this.loading = true
    if (this.profileFeed.length == 0) {
      firebase.database()
        .ref('/quest')
        .orderByChild('user_id')
        .equalTo(UserStore.user.id)
        .on('value', (quests) => {
          if (quests) {
            // console.error(quests)
            quests.forEach(q => {
              var quest = q.val()
              quest.id = q.key
              if(!this.alreadyExist(quest.id)) {
                this.profileFeed.push(quest)
              }
            })
            UserStore.user.solution.forEach(s_id => {
              firebase.database()
                .ref('/quest')
                .orderByChild(`solution/${s_id}`)
                .equalTo(true)
                .on('value', quests => {
                  if (quests) {
                    quests.forEach(q => {
                      var quest = q.val()
                        quest.id = q.key
                      if(!this.alreadyExist(quest.id)) {
                        this.profileFeed.push(quest)
                      }
                    })
                  }
                })
            })
          }
        })
        setTimeout(() => {this.loading = false}, 2000)
    }
  }

  updateBio = (profile) => {
    let bio = profile.state.bio

    const updates = {}
    updates[`/user/${UserStore.user.id}/description`] = bio

    firebase.database()
      .ref()
      .update(updates)
      .then(() => {
        UserStore.user.description = bio
        profile.setState({editing: false})
      })
      .catch((error) => {
        this.loading = false;
        this.error = error.message;
      }) 
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

export default new ProfileStore();