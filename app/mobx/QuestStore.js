import { observable, computed } from 'mobx';
import { ToastAndroid } from 'react-native';
import firebase from 'react-native-firebase';
import FeedStore from './FeedStore.js';
import UserStore from './UserStore.js';
import moment from 'moment';

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
    this.current_solutions.splice(0, this.current_solutions.length)
    navigation.navigate("Quest")
    this.initializing = true
    firebase.database()
      .ref('solution/').orderByChild("quest_id").equalTo(quest._id)
      .on('child_added', solutions => {
        if (solutions !== null) {
          // uncomment if something happen
          // this.current_solutions.splice(0, this.current_solutions.length)
          // solutions.forEach(s => {
            var solution = solutions.val()
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
              .on('value', replies => {
                if (replies !== null) {
                  var reps = []
                  replies.forEach(r => {
                    var reply = r.val()

                    reps.push(reply)
                  })
                  solution.reply = reps
                }
                this.addSolution(solution)
              })
          // })
        }
      })

    setTimeout(() => {this.initializing = false}, 2000)

  }

  addSolution = solution => {
    var has_added = false
    this.current_solutions.forEach((s, index) => {
      if(solution._id == s._id) {
        this.current_solutions[index] = solution
        has_added = true
      }
    })
    if(!has_added) {
      this.current_solutions.push(solution)
    }
  }

  solutionNotification = (quest) => {
    let n = {
      description: UserStore.user.username + " posted a solution to your quest.",
      date_created: moment().format(),
      user_id: quest.user_id,
      quest_id: quest._id,
      is_read: false
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

  postSolution = (solution, _this) => {
    this.loading = true;

    let s = solution

    const newSolutionKey = firebase.database().ref().child('/solution').push().key
    s._id = newSolutionKey

    const updates = {}
    updates[`/user/${s.user_id}/solution/${newSolutionKey}`] = true
    updates[`/solution/${s._id}`] = s

    UserStore.user.experience += 40
    updates[`/user/${UserStore.user._id}/experience`] = UserStore.user.experience

    // exp
    var did_level_up = false
    if(UserStore.user.experience >= UserStore.user.level_exp) {
      updates[`/user/${UserStore.user._id}/level`] = UserStore.user.level + 1
      UserStore.user.level += 1
      updates[`/user/${UserStore.user._id}/level_exp`] = (2 * UserStore.user.level_exp) + Math.round(UserStore.user.level_exp * 0.10)
      UserStore.user.level_exp += UserStore.user.level_exp + Math.round(UserStore.user.level_exp * 0.10)
      did_level_up = true
    }

    // todo
    var index = this.inTodo("Post Solution")
    if(index != -1) {
      UserStore.user.todos[UserStore.user.current_todo - 1].requirements[index].current += 1
      updates[`/user/${UserStore.user._id}/todos/${UserStore.user.todos[UserStore.user.current_todo - 1]._id}/requirements/${index}/current`] = UserStore.user.todos[UserStore.user.current_todo - 1].requirements[index].current 
      
      if(this.isDone(UserStore.user.todos[UserStore.user.current_todo - 1])) {
        var todo = UserStore.user.todos[UserStore.user.current_todo - 1]
        ToastAndroid.show('Todo completed!', ToastAndroid.SHORT)
        ToastAndroid.show(todo.experience + ' experiences earned!', ToastAndroid.SHORT)
        ToastAndroid.show(todo.points + ' points earned!', ToastAndroid.SHORT)
        UserStore.user.current_todo += 1
        updates[`/user/${UserStore.user._id}/current_todo`] = UserStore.user.current_todo

        updates[`/user/${UserStore.user._id}/experience`] = UserStore.user.experience + todo.experience
        UserStore.user.experience += todo.experience

        UserStore.user.points += todo.points
        updates[`/user/${UserStore.user._id}/points`] = UserStore.user.points

        UserStore.user.rank = UserStore.ranks[Math.floor(UserStore.user.points / 100)] <= 10000 ? UserStore.ranks[Math.floor(UserStore.user.points / 100)] : UserStore.ranks[9]
        updates[`/user/${UserStore.user._id}/rank`] = UserStore.user.rank

        if(UserStore.user.experience >= UserStore.user.level_exp) {
          updates[`/user/${UserStore.user._id}/level`] = UserStore.user.level + 1
          UserStore.user.level += 1
          updates[`/user/${UserStore.user._id}/level_exp`] = (2 * UserStore.user.level_exp) + Math.round(UserStore.user.level_exp * 0.10)
          UserStore.user.level_exp += UserStore.user.level_exp + Math.round(UserStore.user.level_exp * 0.10)
          did_level_up = true
        }
      }
    }

    firebase.database()
      .ref()
      .update(updates)
      .then(() => {
        this.loading = false;
        this.error = "";
        _this.setState({solution: ""})

        if(solution.user_id != UserStore.user._id) {
          this.solutionNotification(this.current_quest)
        }
        

        ToastAndroid.show('Solution posted successfully!', ToastAndroid.SHORT);
        ToastAndroid.show('40 experience gained!', ToastAndroid.SHORT);
        if(did_level_up) {
          ToastAndroid.show('Level Up!', ToastAndroid.SHORT);
          did_level_up = false
        }

      })
      .catch(error => {
        this.loading = false;
        this.error = error.message;
      })
  }

  inTodo = (question) => {
    if(UserStore.user.current_todo > 5) {
      return -1
    }
    
    var requirements = UserStore.user.todos[UserStore.user.current_todo - 1].requirements
    for(var i = 0; i < requirements.length; i++) {
      if(requirements[i].requirement == question) {
        return i
      }
    }
    
    return -1
  } 

  isDone = (todo) => {
    for(var i = 0; i < todo.requirements.length; i++) {
      if(todo.requirements[i].current < todo.requirements[i].no) {
        return false
      }
    }

    return true
  }

  deleteQuest = (navigation) => {
    this.current_solutions.forEach(solution => {

      if (solution.reply.length > 0) {
        firebase.database()
          .ref('/reply')
          .orderByChild('solution_id')
          .equalTo(solution._id)
          .once('value', reps => {
            const updates = {}
            reps.foreEach(r => {
              update[`/reply/${r.key}`] = null
              updates[`/user/${UserStore.user._id}/reply/${reply._id}`] = null
            })

            firebase.database()
              .ref()
              .update(updates)
              .then(() => {
                this.removeReply(solution, reply)
              })
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
            .catch(error => this.error = error.message)
        })
        .catch(error => {this.error = error.message})  
    })

    firebase.database()
      .ref('/notification')
      .orderByChild('quest_id')
      .equalTo(this.current_quest._id)
      .once('value', notifs => {
        const updates = {}
        notifs.forEach(n => {
          updates[n.key] = null
        })

        firebase.database()
          .ref('/notification')
          .update(updates)
      })

    firebase.database()
      .ref('/quest')
      .child(this.current_quest._id)
      .remove()
      .then(() => {
        this.loading = false;
        this.error = "";
        FeedStore.removeQuest(quest)
        const {goBack} = navigation
        goBack()
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

  flagAsDuplicate = () => {
    const updates = {}
    updates[`quest/${this.current_quest._id}/is_duplicate`] = true

    firebase.database()
      .ref()
      .update(updates)
      .then(() => {
        ToastAndroid.show('Succesfully flaged a quest', ToastAndroid.SHORT);
      })
      .catch(error => {
        this.error = error.message
      })
  }
}

export default new QuestStore();