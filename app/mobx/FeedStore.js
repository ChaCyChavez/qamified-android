import { observable, computed } from 'mobx';
import firebase from 'react-native-firebase';
import UserStore from './UserStore.js';
import moment from 'moment';
import { ToastAndroid } from 'react-native'

class FeedStore {
  @observable
  loading = false

  @observable
  error = ""

  @observable
  current_quest = {}

  @observable
  quests = []

  initFeed = (category) => {
    this.loading = true
    // if (this.quests.length == 0) {
      if(!category) {
        // this.quests.splice(0,this.quests.length)
        firebase.database()
        .ref('/quest')
        .on('value', (quests) => { // value
          if (quests) {
            var qs = []
            quests.forEach(q => {
              var quest = q.val()
              quest._id =  q.key
              var upvotes = []
              var downvotes = []
              var solutions = []

              if(quest.solution) {
                Object.keys(quest.solution).forEach(s => {
                  solutions.push(s)
                })
              }

              if(quest.upvote) {
                Object.keys(quest.upvote).forEach(u => {
                  upvotes.push(u)
                })
              }

              if(quest.downvote) {
                Object.keys(quest.downvote).forEach(d => {
                  downvotes.push(d)
                })
              }

              quest.solution = solutions
              quest.upvote = upvotes
              quest.downvote = downvotes

              qs.unshift(quest)
            })
            this.quests = qs
            this.loading = false
          }
        })
      } else {
        // this.quests.splice(0,this.quests.length)
        firebase.database()
        .ref('/quest')
        .orderByChild('category')
        .equalTo(category)
        .on('value', (quests) => { // value
          if (quests) {
            // uncomment
            var qs = []
            quests.forEach(q => {
              var quest = q.val()
              quest._id =  q.key
              var upvotes = []
              var downvotes = []
              var solutions = []

              if(quest.solution) {
                Object.keys(quest.solution).forEach(s => {
                  solutions.push(s)
                })
              }

              if(quest.upvote) {
                Object.keys(quest.upvote).forEach(u => {
                  upvotes.push(u)
                })
              }

              if(quest.downvote) {
                Object.keys(quest.downvote).forEach(d => {
                  downvotes.push(d)
                })
              }

              quest.solution = solutions
              quest.upvote = upvotes
              quest.downvote = downvotes

              qs.unshift(quest)
            })
            this.quests = qs
            this.loading = false
          }
        })
      }
    // }
    this.loading = false
  }

  voteNotification = (quest, liked) => {
    let n = {
      description: UserStore.user.username + (liked ? " upvoted" : " downvoted") +  " your post. You " + (liked ? " gained " : " lose ") + "30 points.",
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

  upvoteQuest = (quest) => {
    const updates = {}
    var did_level_up = false
    
    // todo
    //check if first time vote
    var index = this.inTodo("Question")
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

        UserStore.user.rank = UserStore.ranks[Math.floor(UserStore.user.points / 100)]
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

    if (quest.downvote && quest.downvote.includes(UserStore.user._id)) {
      
      updates[`/quest/${quest._id}/downvote/${UserStore.user._id}`] = null
      updates[`/quest/${quest._id}/votes`] = quest.votes + 1  
      
      quest.downvote = quest.downvote.filter(function(user) {
        return user != UserStore.user._id;
      });
      
      firebase.database()
        .ref()
        .update(updates)
        .then(() => {
          this.loading = false
          this.error = ""
          quest.votes += 1
          if(quest.user_id != UserStore.user._id) {
            this.voteNotification(quest, true)
          }
          firebase.database()
            .ref('user').child(`${quest.user_id}`)
            .transaction(user => {
              user.points += 30
              user.rank = UserStore.ranks[Math.floor(user.points / 100)]
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
    else if(!(quest.upvote.includes(UserStore.user._id))) {
      updates[`/quest/${quest._id}/upvote/${UserStore.user._id}`] = true
      updates[`/quest/${quest._id}/votes`] = quest.votes + 1
      quest.upvote.push(UserStore.user._id)
      
      firebase.database()
        .ref()
        .update(updates)
        .then(() => {
          this.loading = false
          this.error = ""
          quest.votes += 1
          if(quest.user_id != UserStore.user._id) {
            this.voteNotification(quest, true)
          }
          firebase.database()
            .ref('user').child(`${quest.user_id}`)
            .transaction(user => {
              user.points += 30
              user.rank = UserStore.ranks[Math.floor(user.points / 100)]
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

  downvoteQuest = (quest) => {
    const updates = {}
    var did_level_up = false

    // todo
    //check if first time vote
    var index = this.inTodo("Question")
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

        UserStore.user.rank = UserStore.ranks[Math.floor(UserStore.user.points / 100)]
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

    if (quest.upvote && quest.upvote.includes(UserStore.user._id)) {
      updates[`/quest/${quest._id}/upvote/${UserStore.user._id}`] = null
      updates[`/quest/${quest._id}/votes`] = quest.votes - 1

      quest.upvote = quest.upvote.filter(function(user) {
        return user != UserStore.user._id;
      });

      firebase.database()
        .ref()
        .update(updates)
        .then(() => {
          this.loading = false
          this.error = ""
          quest.votes -= 1
          if(quest.user_id != UserStore.user._id) {
            this.voteNotification(quest, false)
          }
          firebase.database()
            .ref('user').child(`${quest.user_id}`)
            .transaction(user => {
              user.points -= 30
              user.rank = UserStore.ranks[Math.floor(user.points / 100)]
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
    else if(!(quest.downvote.includes(UserStore.user._id))) {
      updates[`/quest/${quest._id}/downvote/${UserStore.user._id}`] = true
      updates[`/quest/${quest._id}/votes`] = quest.votes - 1

      quest.downvote.push(UserStore.user._id)
      
      firebase.database()
        .ref()
        .update(updates)
        .then(() => {
          this.loading = false
          this.error = ""
          quest.votes -= 1
          if(quest.user_id != UserStore.user._id) {
            this.voteNotification(quest, false)
          }
          firebase.database()
            .ref('user').child(`${quest.user_id}`)
            .transaction(user => {
              user.points -= 30
              user.rank = UserStore.ranks[Math.floor(user.points / 100)]
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

  removeQuest = quest => {
    for(let i = 0; i < quests.length; i++) {
      if(quests[i]._id == quest._id) {
        quests.splice(i, 1)
      }
    }
  }
}

export default new FeedStore();