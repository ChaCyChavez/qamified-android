import { observable, computed } from 'mobx';
import firebase from 'react-native-firebase';
import UserStore from './UserStore';
import FeedStore from './FeedStore';

class ProfileStore {
  @observable
  loading = false

  @observable
  editing = false

  @observable
  profileFeed = []

  alreadyExist(id) {

    this.profileFeed.forEach(quest => {
      if(quest._id == id) {
        return true
      }
    })
    return false
  }

  initProfileFeed = () => {
    this.loading = true
    if (this.profileFeed.length == 0) {

      FeedStore.quests.forEach(quest => {
        if(quest.user_id == UserStore.user.id) {
          if(!this.alreadyExist(quest.id)) {
            this.profileFeed.push(quest)
          }
        }
      })

      UserStore.user.solution.forEach(s_id => {
        FeedStore.quests.forEach(quest => {
          if(quest.solution.includes(s_id)) {
            if(!this.alreadyExist(quest.id)) {
              this.profileFeed.push(quest)
            }
          }
        })
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
}

export default new ProfileStore();