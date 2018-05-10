import { observable, computed } from 'mobx';
import firebase from 'react-native-firebase';
import FeedStore from './FeedStore.js';
import UserStore from './UserStore.js';
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

class QuestStore {
  @observable
  loading = false

  @observable
  initializing = false

  @observable
  error = ""

  @observable
  solution = ""

  @observable
  current_quest = {}

  @observable
  current_solutions = []

  setCurrentQuest = (quest, navigation) => {
    this.current_quest = quest;
    this.current_solutions = []
    navigation.navigate("Quest")
    this.initializing = true
    firebase.database()
      .ref('solution/').orderByChild("quest_id").equalTo(quest._id)
      .on('value', solutions => {
        if (solutions !== null) {
          solutions.forEach(s => {
            var solution = s.val()
            solution.reply = []
            var upvotes = []
            var downvotes = []

            if(solution.upvote) {
              Object.keys(solution.upvote).forEach(u => {
                upvotes.push(u)
              })
            }

            if(solution.downvote) {
              Object.keys(solution.downvote).forEach(d => {
                downvotes.push(d)
              })
            }

            solution.upvote = upvotes
            solution.downvote = downvotes

            firebase.database()
              .ref('reply/').orderByChild("solution_id").equalTo(solution._id)
              .once('value', replies => {
                if (replies !== null) {
                  replies.forEach(r => {
                    var reply = r.val()

                    solution.reply.push(reply)
                  })
                }
                this.current_solutions.push(solution)
              })
          })
        }
      })

    setTimeout(() => {this.initializing = false}, 2000)

  }

  solutionNotification = (quest) => {
    let n = {
      description: UserStore.user.username + " posted a solution to your quest.",
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

  postSolution = solution => {
    this.loading = true;

    let s = solution

    const newSolutionKey = firebase.database().ref().child('/solution').push().key
    s._id = newSolutionKey

    const updates = {}
    updates[`/quest/${s.quest_id}/solution/${newSolutionKey}`] = true
    updates[`/user/${s.user_id}/solution/${newSolutionKey}`] = true
    updates[`/solution/${s._id}`] = s

    firebase.database()
      .ref()
      .update(updates)
      .then(() => {
        this.loading = false;
        this.error = "";
        this.solution = "";
        this.current_solutions.push(s);

        this.solutionNotification(this.current_quest)

      })
      .catch(error => {
        this.loading = false;
        this.error = error.message;
      })
  }

  deleteQuest = (navigation) => {
    this.current_solutions.forEach(solution => {

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
    })

    firebase.database()
      .ref('/quest')
      .child(this.current_quest._id)
      .remove()
      .then(() => {
        this.loading = false;
        this.error = "";
        navigation.navigate("Tab")
        FeedStore.removeQuest(quest)
      })
      .catch(error => {
        this.loading = false;
        this.error = error.message;
      })
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
    for(let i = 0; i < this.current_solutions.length; i++) {
      if(this.current_solutions[i]._id == sol._id) {
        this.current_solutions.splice(i, 1)
        break
      }
    }
  }
}

export default new QuestStore();