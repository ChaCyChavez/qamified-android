import { observable, computed } from 'mobx';
import firebase from 'react-native-firebase';

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
}

export default new SolutionStore();