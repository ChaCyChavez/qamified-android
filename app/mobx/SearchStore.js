import { observable, computed } from 'mobx';
import firebase from 'react-native-firebase';
import FeedStore from './FeedStore.js';
import { ToastAndroid } from 'react-native';

class SearchStore {

  @observable
  loading = false

  @observable
  error = ""

  @observable
  results = []

  search = (query, navigation) => {
    this.results = []
    FeedStore.quests.forEach(quest => {
      if(quest.title.toLowerCase().includes(query.toLowerCase())) {
        this.results.push(quest)
      }
    })

    navigation.navigate('SearchResult')
  }
}

export default new SearchStore();