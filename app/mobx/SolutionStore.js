import { observable, computed } from 'mobx';
import { ToastAndroid } from 'react-native'
import firebase from 'react-native-firebase';
import UserStore from './UserStore.js';
import QuestStore from './QuestStore';
import moment from 'moment';

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

  postReply = (reply, solution, _this) => {

    let r = reply

    const newReplyKey = firebase.database().ref().child('reply').push().key
    r._id = newReplyKey

    const updates = {}
    updates[`/user/${r.user_id}/reply/${newReplyKey}`] = true
    updates[`/reply/${r._id}`] = r

    updates[`/user/${UserStore.user._id}/experience`] = UserStore.user.experience + 5
    UserStore.user.experience += 5
    var did_level_up = false
    if(UserStore.user.experience >= UserStore.user.level_exp) {
      updates[`/user/${UserStore.user._id}/level`] = UserStore.user.level + 1
      UserStore.user.level += 1
      updates[`/user/${UserStore.user._id}/level_exp`] = (2 * UserStore.user.level_exp) + Math.round(UserStore.user.level_exp * 0.10)
      UserStore.user.level_exp += UserStore.user.level_exp + Math.round(UserStore.user.level_exp * 0.10)
      did_level_up = true
    }

    firebase.database()
      .ref()
      .update(updates)
      .then(() => {
        this.loading = false
        this.error = ""
        _this.setState({reply: ""})
        
        ToastAndroid.show('Replied successfully!', ToastAndroid.SHORT);
        ToastAndroid.show('5 experience gained!', ToastAndroid.SHORT);
        if(did_level_up) {
          ToastAndroid.show('Level Up!', ToastAndroid.SHORT);
          did_level_up = false
        }

        this.replyNotification(QuestStore.current_quest)
      })
      .catch((error) => {
        this.loading = false
        this.error = error.message
      })
  }

  voteNotification = (quest, liked) => {
    let n = {
      description: UserStore.user.username + (liked ? " upvoted" : " downvoted") +  " your solution. You " + (liked ? " gain " : " lose ") + "40 points.",
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
    if (solution.downvote && solution.downvote.includes(UserStore.user._id)) {
      const updates = {}
      updates[`/solution/${solution._id}/downvote/${UserStore.user._id}`] = null
      updates[`/solution/${solution._id}/votes`] = solution.votes + 1

      solution.downvote = solution.downvote.filter(function(user) {
        return user != UserStore.user._id;
      });

      firebase.database()
        .ref()
        .update(updates)
        .then(() => {
          this.loading = false
          this.error = ""
          solution.votes += 1

          this.voteNotification(QuestStore.current_quest, true)

          firebase.database()
            .ref('user').child(`${solution.user_id}`)
            .transaction(user => {
              user.points += 40
              user.rank = UserStore.ranks[Math.floor(user.points / 100)]
              return user
            })
        })
        .catch((error) => {
          this.loading = false
          this.error = error.message
        })
    }
    else if(!(solution.upvote.includes(UserStore.user._id))) {
      const updates = {}
      updates[`/solution/${solution._id}/upvote/${UserStore.user._id}`] = true
      updates[`/solution/${solution._id}/votes`] = solution.votes + 1

      solution.upvote.push(UserStore.user._id)

      firebase.database()
        .ref()
        .update(updates)
        .then(() => {
          this.loading = false
          this.error = ""
          solution.votes += 1

          this.voteNotification(QuestStore.current_quest, true)

          firebase.database()
            .ref('user').child(`${solution.user_id}`)
            .transaction(user => {
              user.points += 40
              user.rank = UserStore.ranks[Math.floor(user.points / 100)]
              return user
            })
        })
        .catch((error) => {
          this.loading = false
          this.error = error.message
        })
    }
  }

  downvoteSolution = solution => {

    if (solution.upvote && solution.upvote.includes(UserStore.user._id)) {
      const updates = {}
      updates[`/solution/${solution._id}/upvote/${UserStore.user._id}`] = null
      updates[`/solution/${solution._id}/votes`] = solution.votes - 1

      solution.upvote = solution.upvote.filter(function(user) {
        return user != UserStore.user._id;
      });

      firebase.database()
        .ref()
        .update(updates)
        .then(() => {
          this.loading = false
          this.error = ""
          solution.votes -= 1

          this.voteNotification(QuestStore.current_quest, false)

          firebase.database()
            .ref('user').child(`${solution.user_id}`)
            .transaction(user => {
              user.points -= 40
              user.rank = UserStore.ranks[Math.floor(user.points / 100)]
              return user
            })
        })
        .catch((error) => {
          this.loading = false
          this.error = error.message
        })
    }
    else if(!(solution.downvote.includes(UserStore.user._id))) {
      const updates = {}
      updates[`/solution/${solution._id}/downvote/${UserStore.user._id}`] = true
      updates[`/solution/${solution._id}/votes`] = solution.votes - 1


      solution.downvote.push(UserStore.user._id)
          
      firebase.database()
        .ref()
        .update(updates)
        .then(() => {
          this.loading = false
          this.error = ""
          solution.votes -= 1

          this.voteNotification(QuestStore.current_quest, false)

          firebase.database()
            .ref('user').child(`${solution.user_id}`)
            .transaction(user => {
              user.points -= 40
              user.rank = UserStore.ranks[Math.floor(user.points / 100)]
              return user
            })
        })
        .catch((error) => {
          this.loading = false
          this.error = error.message
        })
    }
  }

  markAsSolutionNotification = (quest) => {
    let n = {
      description: UserStore.user.username + " marked your solution as answer. You gain 80 points",
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

  markAsSolution = solution => {
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

            firebase.database()
            .ref('user').child(`${solution.user_id}`)
            .transaction(user => {
              user.points += 80
              user.rank = UserStore.ranks[Math.floor(user.points / 100)]
              return user
            })

            this.markAsSolutionNotification(QuestStore.current_quest)
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
            updates[`/user/${UserStore.user._id}/reply/${reply._id}`] = null

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
        updates[`/user/${UserStore.user._id}/solution/${solution._id}`] = null

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