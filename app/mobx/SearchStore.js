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
    FeedStore.quests.forEach(quest => {
      if(quest.title.includes(query)) {
        this.results.push(quest)
      }
    })

    navigation.navigate('SearchResult')
  }
}

export default new SearchStore();