import { observable, computed } from 'mobx';
import firebase from '../firebase/firebase.js';

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

class LoginStore {
  @observable
  loading = false

  @observable
  error = ""

  postQuest = (navigation, quest) => {
    this.createQuestState.loading = true;
    var currDate = new Date();
    this.quest = {
      date_created: currDate.getTime(),
      title: quest.title,
      description: quest.description,
      votes: 0,
      user_id: this.user.id,
      is_answered: false,
      username: this.user.username,
      full_name: "{0} {1}. {2}".format(this.user.first_name, this.user.middle_name.charAt(0), this.user.last_name),
      solutions: {},
    }

    firebase.database()
      .ref('posts').push().set(this.quest)
      .then(() => {
        this.createQuestState.loading = false;
        this.createQuestState.error = "";
        navigation.navigate('Tab');
      })
      .catch((error) => {
        this.createQuestState.loading = false;
        this.createQuestState.error = error.message;
      })
  }


  setCurrentQuest = (quest) => {
    this.questState.current_quest = quest;
  };
}

export default new QuestStore();