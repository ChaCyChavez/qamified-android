import { observable, computed } from 'mobx';
import firebase from 'react-native-firebase';
import FeedStore from './FeedStore.js';
import UserStore from './UserStore.js';

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
      .once('value', solutions => {
        if (solutions !== null) {
          solutions.forEach(s => {
            var solution = s.val()
            solution.reply = []

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

  postSolution = (solution) => {
    this.loading = true;

    let s = solution

    const newSolutionKey = firebase.database().ref().child('solution').push().key
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
      })
      .catch((error) => {
        this.loading = false;
        this.error = error.message;
      })
  }
}

export default new QuestStore();