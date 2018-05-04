import { observable, computed } from 'mobx';
import firebase from 'react-native-firebase';
import UserStore from './UserStore.js';
import QuestStore from './QuestStore';
// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

class SolutionStore {
  @observable
  loading = false

  @observable
  error = ""

  @observable
  reply = ""

  postReply = (reply, solution) => {

    let r = reply

    const newReplyKey = firebase.database().ref().child('reply').push().key
    r._id = newReplyKey

    const updates = {}
    updates[`/solution/${r.solution_id}/reply/${newReplyKey}`] = true
    updates[`/user/${r.user_id}/reply/${newReplyKey}`] = true
    updates[`/reply/${r._id}`] = r

    firebase.database()
      .ref()
      .update(updates)
      .then(() => {
        this.loading = false
        this.error = ""
        this.reply = ""
        solution.reply.push(r)
      })
      .catch((error) => {
        this.loading = false
        this.error = error.message
      })
  }

  upvoteSolution = (solution) => {
    const updates = {}
    updates[`solution/${solution._id}/upvote/${UserStore.user.id}`] = true
    updates[`solution/${solution._id}/votes`] = solution.votes + 1

    firebase.database()
      .ref()
      .update(updates)
      .then(() => {
        this.loading = false
        this.error = ""
        solution.votes += 1
      })
      .catch((error) => {
        this.loading = false
        this.error = error.message
      })
  }

  downvoteSolution = (solution) => {
    const updates = {}
    updates[`solution/${solution._id}/downvote/${UserStore.user.id}`] = true
    updates[`solution/${solution._id}/votes`] = solution.votes - 1

    firebase.database()
      .ref()
      .update(updates)
      .then(() => {
        this.loading = false
        this.error = ""
        solution.votes -= 1
      })
      .catch((error) => {
        this.loading = false
        this.error = error.message
      })
  }

  markAsSolution = (solution) => {
    const updates = {}
    updates[`solution/${solution._id}/is_correct`] = true

    firebase.database()
      .ref()
      .update(updates)
      .then(() => {
        this.loading = false
        this.error = ""
        solution.is_correct = true

        const updates = {}
        updates[`quest/${QuestStore.current_quest._id}/is_answered`] = true
        firebase.database()
          .ref()
          .update(updates)
          .then(() => {
            this.loading = false
            this.error = ""
            QuestStore.current_quest.is_answered = true
          })
          .catch((error) => {
            this.loading = false
            this.error = error.message
          })
      })
      .catch((error) => {
        this.loading = false
        this.error = error.message
      })

  }
}

export default new SolutionStore();