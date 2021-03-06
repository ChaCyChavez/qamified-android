import { observable, computed } from 'mobx'
import firebase from 'react-native-firebase'
import FeedStore from './FeedStore.js'
import { ToastAndroid } from 'react-native'
import moment from 'moment'
import { NavigationActions } from 'react-navigation'

class UserStore {
  @observable
  user = {}

  @observable
  loading = false

  @observable
  error = ""

  @computed
  get fullName(): string {
    return `${this.user.first_name} ${this.user.middle_name ? this.user.middle_name.charAt(0) : ""}. ${this.user.last_name}`
  }

  @observable
  ranks = [
    "Beginner", "Intermediate", "Genius", "Prodigy", "Ace", "Beast", "Champion", "Master", "Grandmaster", "Legendary Grandmaster"
  ]

  checkUser = (navigation) => {
    this.loading = true
    firebase.auth()
      .onAuthStateChanged((user) => {
      if (user != null) {
        this.initUser(user, navigation)
      } else {
        setTimeout(() => {this.loading = false}, 5000)
      }
      
    })
  }

  initUser = (user, navigation) => {
    this.loading = true
    firebase.database()
      .ref(`/user/${user.uid}`)
      .on('value', _user => {
        if (_user.val() != null) {
          this.user = _user.val()
          var reps = []
          var sols = []
          var todos = []

          for(var propt in this.user.todos) {
            var todo = this.user.todos[propt]
            todos.push(todo)
          }

          todos.sort(function(a,b) {return (a.date_created > b.date_created) ? 1 : ((b.date_created > a.date_created) ? -1 : 0);} ); 
          this.user.todos = todos

          // maybe can be optimize by not using firebase (see todos)
          firebase.database()
            .ref(`/user/${_user.key}/reply`)
            .once('value', (replies) => {
              if (replies) {
                replies.forEach(r => {
                  var reply = r.key
                  reps.push(reply)
                })
                this.user.reply = reps
              }
              firebase.database()
                .ref(`/user/${_user.key}/solution`)
                .once('value', (solutions) => {
                  if (solutions) {
                    solutions.forEach(s => {
                      var solution = s.key
                      sols.push(solution)
                    })
                    this.user.solution = sols
                    setTimeout(() => {this.loading = false}, 5000)

                    const resetAction = NavigationActions.reset({
                      index: 0,
                      actions: [
                        NavigationActions.navigate({
                          routeName: "Tab",
                        })
                      ]
                    });
                    navigation.dispatch(resetAction);
                  }
                })
            })
        }
      })
  }

  postQuest = (navigation, quest) => {
    this.loading = true; 

    let q = quest

    const newQuestKey = firebase.database().ref().child('quest').push().key
    q._id = newQuestKey

    const updates = {}

    updates[`/quest/${q._id}`] = q
    updates[`/user/${this.user._id}/experience`] = this.user.experience + 30
    this.user.experience += 30
    
    // exp
    var did_level_up = false
    if(this.user.experience >= this.user.level_exp) {
      updates[`/user/${this.user._id}/level`] = this.user.level + 1
      this.user.level += 1
      updates[`/user/${this.user._id}/level_exp`] = (2 * this.user.level_exp) + Math.round(this.user.level_exp * 0.10)
      this.user.level_exp += this.user.level_exp + Math.round(this.user.level_exp * 0.10)
      did_level_up = true
    }

    //todo
    var index = this.inTodo("Create Quest")
    if(index != -1) {
      this.user.todos[this.user.current_todo - 1].requirements[index].current += 1
      updates[`/user/${this.user._id}/todos/${this.user.todos[this.user.current_todo - 1]._id}/requirements/${index}/current`] = this.user.todos[this.user.current_todo - 1].requirements[index].current 
      
      if(this.isDone(this.user.todos[this.user.current_todo - 1])) {
        var todo = this.user.todos[this.user.current_todo - 1]
        ToastAndroid.show('Todo completed!', ToastAndroid.SHORT)
        ToastAndroid.show(todo.experience + ' experiences earned!', ToastAndroid.SHORT)
        ToastAndroid.show(todo.points + ' points earned!', ToastAndroid.SHORT)
        
        this.user.current_todo += 1
        updates[`/user/${this.user._id}/current_todo`] = this.user.current_todo

        updates[`/user/${this.user._id}/experience`] = this.user.experience + todo.experience
        this.user.experience += todo.experience

        this.user.points += todo.points
        updates[`/user/${this.user._id}/points`] = this.user.points

        this.user.rank = Math.floor(UserStore.user.points / 100) <= 9 ? this.ranks[Math.floor(this.user.points / 100)] : this.ranks[9]
        updates[`/user/${this.user._id}/rank`] = this.user.rank

        if(this.user.experience >= this.user.level_exp) {
          this.user.level += 1
          updates[`/user/${this.user._id}/level`] = this.user.level
          
          this.user.level_exp += this.user.level_exp + Math.round(this.user.level_exp * 0.10)
          updates[`/user/${this.user._id}/level_exp`] = this.user.level_exp
          
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
        this.title = ""
        this.description = ""
        navigation.navigate('Tab');
        ToastAndroid.show('Quest posted successfully!', ToastAndroid.SHORT);
        ToastAndroid.show('30 experience gained!', ToastAndroid.SHORT);
        if(did_level_up) {
          ToastAndroid.show('Level Up!', ToastAndroid.SHORT);
          did_level_up = false
        }
      })
      .catch((error) => {
        this.loading = false;
        this.error = error.message;
        this.title = ""
        this.description = ""
      })
  }

  inTodo = (question) => {
    if(this.user.current_todo > 5) {
      return -1
    }
    
    var requirements = this.user.todos[this.user.current_todo - 1].requirements
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

  logOut = (navigation) => {
    firebase.auth()
      .signOut()
      .then(() => {
        navigation.navigate('Login')
      })
  }

  logEvent = (event) => {
    const updates = {}
    let e = {
      description: event,
      username: this.user.username,
      full_name: this.fullName,
      user_id: this.user._id,
      date_created: moment().format()
    }

    const newEventKey = firebase.database().ref().child('log').push().key
    e._id = newEventKey

    updates[`log/${e._id}`] = e

    firebase.database()
      .ref()
      .update(updates)

    firebase.analytics()
      .logEvent(event, {})
  }
}

export default new UserStore();