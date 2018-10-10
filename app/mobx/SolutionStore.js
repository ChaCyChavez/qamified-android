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
      UserStore.user.level += 1
      updates[`/user/${UserStore.user._id}/level`] = UserStore.user.level

      UserStore.user.level_exp += UserStore.user.level_exp + Math.round(UserStore.user.level_exp * 0.10)
      updates[`/user/${UserStore.user._id}/level_exp`] = UserStore.user.level_exp

      did_level_up = true
    }

    //todo
    var index = this.inTodo("Post Reply")
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

        UserStore.user.experience += todo.experience
        updates[`/user/${UserStore.user._id}/experience`] = UserStore.user.experience

        UserStore.user.points += todo.points
        updates[`/user/${UserStore.user._id}/points`] = UserStore.user.points

        UserStore.user.rank = Math.floor(UserStore.user.points / 100) <= 9 ? UserStore.ranks[Math.floor(UserStore.user.points / 100)] : UserStore.ranks[9]
        updates[`/user/${UserStore.user._id}/rank`] = UserStore.user.rank

        if(UserStore.user.experience >= UserStore.user.level_exp) {
          UserStore.user.level += 1
          updates[`/user/${UserStore.user._id}/level`] = UserStore.user.level

          UserStore.user.level_exp += UserStore.user.level_exp + Math.round(UserStore.user.level_exp * 0.10)
          updates[`/user/${UserStore.user._id}/level_exp`] = UserStore.user.level_exp
          did_level_up = true
        }
      }
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

        if(reply.user_id != UserStore.user._id) {
          this.replyNotification(QuestStore.current_quest)
        }
      })
      .catch((error) => {
        this.loading = false
        this.error = error.message
      })
  }

  voteNotification = (quest, solution, liked) => {
    let n = {
      description: UserStore.user.username + (liked ? " upvoted" : " downvoted") +  " your solution. You " + (liked ? " gain " : " lose ") + "40 points.",
      date_created: moment().format(),
      user_id: solution.user_id,
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

  upvoteSolution = solution => {
    const updates = {}
    var did_level_up = false

    //todo
    //check if first time vote
    var index = this.inTodo("Vote Solution")
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

        UserStore.user.rank = Math.floor(UserStore.user.points / 100) <= 9 ? UserStore.ranks[Math.floor(UserStore.user.points / 100)] : UserStore.ranks[9]
        updates[`/user/${UserStore.user._id}/rank`] = UserStore.user.rank

        if(UserStore.user.experience >= UserStore.user.level_exp) {
          UserStore.user.level += 1
          updates[`/user/${UserStore.user._id}/level`] = UserStore.user.level

          UserStore.user.level_exp += UserStore.user.level_exp + Math.round(UserStore.user.level_exp * 0.10)
          updates[`/user/${UserStore.user._id}/level_exp`] = UserStore.user.level_exp
          
          did_level_up = true
        }
      }
    }

    if (solution.downvote && solution.downvote.includes(UserStore.user._id)) {
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

          if(solution.user_id != UserStore.user._id) {
            this.voteNotification(QuestStore.current_quest, solution, true)
          }

          firebase.database()
            .ref('user').child(`${solution.user_id}`)
            .transaction(user => {
              if(user != null) {
                user.points += 40
                user.rank = Math.floor(user.points / 100) <= 9 ? UserStore.ranks[Math.floor(user.points / 100)] : UserStore.ranks[9]
              }
              return user
            })
          if(did_level_up) {
            ToastAndroid.show('Level Up!', ToastAndroid.SHORT);
            did_level_up = false
          }
        })
        .catch((error) => {
          this.loading = false
          this.error = error.message
        })
    }
    else if(!(solution.upvote.includes(UserStore.user._id))) {
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

          if(solution.user_id != UserStore.user._id) {
            this.voteNotification(QuestStore.current_quest, solution, true)
          }

          firebase.database()
            .ref('user').child(`${solution.user_id}`)
            .transaction(user => {
              if(user != null) {
                user.points += 40
                user.rank = Math.floor(user.points / 100) <= 9 ? UserStore.ranks[Math.floor(user.points / 100)] : UserStore.ranks[9]
              }
              return user
            })
          if(did_level_up) {
            ToastAndroid.show('Level Up!', ToastAndroid.SHORT);
            did_level_up = false
          }
        })
        .catch((error) => {
          this.loading = false
          this.error = error.message
        })
    }
  }

  downvoteSolution = solution => {
    const updates = {}
    var did_level_up = false
    //todo
    //check if first time vote
    var index = this.inTodo("Vote Solution")
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

        UserStore.user.rank = Math.floor(UserStore.user.points / 100) <= 9 ? UserStore.ranks[Math.floor(UserStore.user.points / 100)] : UserStore.ranks[9]
        updates[`/user/${UserStore.user._id}/rank`] = UserStore.user.rank

        if(UserStore.user.experience >= UserStore.user.level_exp) {
          UserStore.user.level += 1
          updates[`/user/${UserStore.user._id}/level`] = UserStore.user.level

          UserStore.user.level_exp += UserStore.user.level_exp + Math.round(UserStore.user.level_exp * 0.10)
          updates[`/user/${UserStore.user._id}/level_exp`] = UserStore.user.level_exp
          
          did_level_up = true
        }
      }
    }

    if (solution.upvote && solution.upvote.includes(UserStore.user._id)) {
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

          if(solution.user_id != UserStore.user._id) {
            this.voteNotification(QuestStore.current_quest, solution, false)
          }

          firebase.database()
            .ref('user').child(`${solution.user_id}`)
            .transaction(user => {
              if(user != null) {
                user.points -= 40
                user.rank = Math.floor(user.points / 100) <= 9 ? UserStore.ranks[Math.floor(user.points / 100)] : UserStore.ranks[9]
              }
              return user
            })
          if(did_level_up) {
            ToastAndroid.show('Level Up!', ToastAndroid.SHORT);
            did_level_up = false
          }
        })
        .catch((error) => {
          this.loading = false
          this.error = error.message
        })
    }
    else if(!(solution.downvote.includes(UserStore.user._id))) {
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

          if(solution.user_id != UserStore.user._id) {
            this.voteNotification(QuestStore.current_quest, solution, false)
          }

          firebase.database()
            .ref('user').child(`${solution.user_id}`)
            .transaction(user => {
              if(user != null) {
                user.points -= 40
                user.rank = Math.floor(user.points / 100) <= 9 ? UserStore.ranks[Math.floor(user.points / 100)] : UserStore.ranks[9]
              }
              return user
            })
          if(did_level_up) {
            ToastAndroid.show('Level Up!', ToastAndroid.SHORT);
            did_level_up = false
          }
        })
        .catch((error) => {
          this.loading = false
          this.error = error.message
        })
    }
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

  markAsSolutionNotification = (quest) => {
    let n = {
      description: UserStore.user.username + " marked your solution as answer. You gain 80 points",
      date_created: moment().format(),
      user_id: quest.user_id,
      quest_id: quest._id,
      is_read: false
    }
    
    const newQuestKey = firebase.database().ref().child('notification').push().key
    n._id = newQuestKey

    const updates = {}
    updates[`/notification/${n._id}`] = n

    var did_level_up = false

    //todo
    //check if first time vote
    var index = this.inTodo("Correct Solution")
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

        UserStore.user.rank = Math.floor(UserStore.user.points / 100) <= 9 ? UserStore.ranks[Math.floor(UserStore.user.points / 100)] : UserStore.ranks[9]
        updates[`/user/${UserStore.user._id}/rank`] = UserStore.user.rank

        if(UserStore.user.experience >= UserStore.user.level_exp) {
          UserStore.user.level += 1
          updates[`/user/${UserStore.user._id}/level`] = UserStore.user.level

          UserStore.user.level_exp += UserStore.user.level_exp + Math.round(UserStore.user.level_exp * 0.10)
          updates[`/user/${UserStore.user._id}/level_exp`] = UserStore.user.level_exp
          
          did_level_up = true
        }
      }
    }

    firebase.database()
      .ref()
      .update(updates)
      .then(() => {
        this.loading = false
        this.error = ""
        if(did_level_up) {
          ToastAndroid.show('Level Up!', ToastAndroid.SHORT);
          did_level_up = false
        }
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
                if(user != null) {
                  user.points += 80
                  user.rank = Math.floor(user.points / 100) <= 9 ? UserStore.ranks[Math.floor(user.points / 100)] : UserStore.ranks[9]
                }
                return user
              })

            if(solution.user_id != UserStore.user._id) {
              this.markAsSolutionNotification(QuestStore.current_quest)
            }
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
              .catch(error => this.error = error.message)
          })
          .catch(error => {this.error = error.message})
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