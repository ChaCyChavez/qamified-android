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

class UserStore {
  @observable user = {};

  @computed
  get fullName(): string {
    return "{0} {1}. {2}".format(this.user.first_name, this.user.middle_name.charAt(0), this.user.last_name);
  }
}

export default new UserStore();