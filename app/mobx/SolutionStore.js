import { observable, computed } from 'mobx';
import firebase from 'react-native-firebase';
import UserStore from './UserStore.js';
import QuestStore from './QuestStore';
import moment from 'moment';

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

  replyNotification = (quest) => {
    let n = {
      description: UserStore.user.username + " posted a reply to your solution.",
      date_created: moment().format(),
      user_id: quest.user_id,
      quest_id: quest._id,
    }

    const newQuestKey = firebase.database().ref().child('notification').push().key
    n._id = newQuestKey
    console.error(n)

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

        this.replyNotification(QuestStore.current_quest)
      })
      .catch((error) => {
        this.loading = false
        this.error = error.message
      })
  }

  voteNotification = (quest, liked) => {
    let n = {
      description: UserStore.user.username + (liked ? " upvoted" : " downvoted") +  " your solution.",
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

  upvoteSolution = solution => {
    if (solution.downvote && solution.downvote.includes(UserStore.user.id)) {
      const updates = {}
      updates[`/solution/${solution._id}/downvote/${UserStore.user.id}`] = null
      updates[`/solution/${solution._id}/votes`] = solution.votes + 1

      solution.downvote = solution.downvote.filter(function(user) {
        return user != UserStore.user.id;
      });

      firebase.database()
        .ref()
        .update(updates)
        .then(() => {
          this.loading = false
          this.error = ""
          solution.votes += 1

          this.voteNotification(QuestStore.current_quest, true)
        })
        .catch((error) => {
          this.loading = false
          this.error = error.message
        })
    }
    else if(!(solution.upvote.includes(UserStore.user.id))) {
      const updates = {}
      updates[`/solution/${solution._id}/upvote/${UserStore.user.id}`] = true
      updates[`/solution/${solution._id}/votes`] = solution.votes + 1

      solution.upvote.push(UserStore.user.id)

      firebase.database()
        .ref()
        .update(updates)
        .then(() => {
          this.loading = false
          this.error = ""
          solution.votes += 1

          this.voteNotification(QuestStore.current_quest, true)
        })
        .catch((error) => {
          this.loading = false
          this.error = error.message
        })
    }
  }

  downvoteSolution = solution => {

    if (solution.upvote && solution.upvote.includes(UserStore.user.id)) {
      const updates = {}
      updates[`/solution/${solution._id}/upvote/${UserStore.user.id}`] = null
      updates[`/solution/${solution._id}/votes`] = solution.votes - 1

      solution.upvote = solution.upvote.filter(function(user) {
        return user != UserStore.user.id;
      });

      firebase.database()
        .ref()
        .update(updates)
        .then(() => {
          this.loading = false
          this.error = ""
          solution.votes -= 1

          this.voteNotification(QuestStore.current_quest, false)
        })
        .catch((error) => {
          this.loading = false
          this.error = error.message
        })
    }
    else if(!(solution.downvote.includes(UserStore.user.id))) {
      const updates = {}
      updates[`/solution/${solution._id}/downvote/${UserStore.user.id}`] = true
      updates[`/solution/${solution._id}/votes`] = solution.votes - 1


      solution.downvote.push(UserStore.user.id)
          
      firebase.database()
        .ref()
        .update(updates)
        .then(() => {
          this.loading = false
          this.error = ""
          solution.votes -= 1

          this.voteNotification(QuestStore.current_quest, false)
        })
        .catch((error) => {
          this.loading = false
          this.error = error.message
        })
    }
  }

  markAsSolution = solution => {
    const updates = {}
    updates[`quest/${solution._id}/is_correct`] = true

    firebase.database()
      .ref()
      .update(updates)
      .then(() => {
        this.loading = false
        this.error = ""
        solution.is_correct = true

        const updates = {}
        updates[`solution/${QuestStore.current_quest._id}/is_answered`] = true
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

  deleteSolution = solution => {
    if (solution.reply.length > 0) {
      solution.reply.forEach(reply => {
        firebase.database()
          .ref('/reply')
          .child(reply._id)
          .remove()
          .then(() => {
            const updates = {}
            updates[`/user/${UserStore.user.id}/reply/${reply._id}`] = null

            firebase.database()
              .ref()
              .update(updates)
              .then(() => {
                this.removeReply(solution, reply)
              })
              .catch(error => console.error(error))
          })
          .catch(error => {console.error(error)})
      })
    }
    firebase.database()
      .ref('/solution')
      .child(solution._id)
      .remove()
      .then(() => {
        const updates = {}
        updates[`/user/${UserStore.user.id}/solution/${solution._id}`] = null

        firebase.database()
          .ref()
          .update(updates)
          .then(() => {
            this.removeSolution(solution)
          })
          .catch(error => console.error(error))
      })
      .catch(error => {console.error(error)})
  }

  removeReply = (sol, rep) => {
    for(let i = 0; i < sol.reply.length; i++) {
      if(sol.reply[i]._id == rep._id) {
        sol.reply.splice(i, 1)
        break
      }
    }
  }

  removeSolution = (sol) => {
    for(let i = 0; i < QuestStore.current_solutions.length; i++) {
      if(QuestStore.current_solutions[i]._id == sol._id) {
        QuestStore.current_solutions.splice(i, 1)
        break
      }
    }
  }
}

export default new SolutionStore();