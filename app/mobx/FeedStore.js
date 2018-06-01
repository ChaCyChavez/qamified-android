import { observable, computed } from 'mobx';
import firebase from 'react-native-firebase';
import UserStore from './UserStore.js';
import moment from 'moment';

class FeedStore {
  @observable
  loading = false

  @observable
  error = ""

  @observable
  current_quest = {}

  @observable
  quests = []

  initFeed = () => {
    this.loading = true
    if (this.quests.length == 0) {
      firebase.database()
      .ref('/quest')
      .on('child_added', (quests) => { // value
        if (quests) {
          // uncomment
          // this.quests.splice(0,this.quests.length)
          // quests.forEach(q => {
            var quest = quests.val()
            quest._id =  quests.key
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

            this.quests.push(quest)
          // })
          this.loading = false
        }
      })
    }
    this.loading = false
  }

  voteNotification = (quest, liked) => {
    let n = {
      description: UserStore.user.username + (liked ? " upvoted" : " downvoted") +  " your post. You " + (liked ? " gained " : " lose ") + "30 points.",
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

  upvoteQuest = (quest) => {
    const updates = {}
    
    // todo
    //check if first time vote
    var index = this.inTodo("Question")
    if(index != -1) {
      UserStore.user.todos[UserStore.user.current_todo - 1].requirements[index].current += 1
      updates[`/user/${UserStore.user._id}/todos/${UserStore.user.todos[UserStore.user.current_todo - 1]._id}/requirements/${index}/current`] = UserStore.user.todos[UserStore.user.current_todo - 1].requirements[index].current 
      
      if(this.isDone(UserStore.user.todos[UserStore.user.current_todo - 1])) {
        UserStore.user.current_todo += 1
        updates[`/user/${UserStore.user._id}/current_todo`] = UserStore.user.current_todo
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
          this.voteNotification(quest, true)
          firebase.database()
            .ref('user').child(`${quest.user_id}`)
            .transaction(user => {
              user.points += 30
              user.rank = UserStore.ranks[Math.floor(user.points / 100)]
              return user
            })
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
          this.voteNotification(quest, true)
          firebase.database()
            .ref('user').child(`${quest.user_id}`)
            .transaction(user => {
              user.points += 30
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

  downvoteQuest = (quest) => {

    const updates = {}

    // todo
    //check if first time vote
    var index = this.inTodo("Question")
    if(index != -1) {
      UserStore.user.todos[UserStore.user.current_todo - 1].requirements[index].current += 1
      updates[`/user/${UserStore.user._id}/todos/${UserStore.user.todos[UserStore.user.current_todo - 1]._id}/requirements/${index}/current`] = UserStore.user.todos[UserStore.user.current_todo - 1].requirements[index].current 
      
      if(this.isDone(UserStore.user.todos[UserStore.user.current_todo - 1])) {
        UserStore.user.current_todo += 1
        updates[`/user/${UserStore.user._id}/current_todo`] = UserStore.user.current_todo
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
          this.voteNotification(quest, false)
          firebase.database()
            .ref('user').child(`${quest.user_id}`)
            .transaction(user => {
              user.points -= 30
              user.rank = UserStore.ranks[Math.floor(user.points / 100)]
              return user
            })
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
          this.voteNotification(quest, false)
          firebase.database()
            .ref('user').child(`${quest.user_id}`)
            .transaction(user => {
              user.points -= 30
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