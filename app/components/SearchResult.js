import React from 'react';
import { StyleSheet,
         TextInput,
         View,
         ScrollView } from 'react-native';
import { List,
         ListItem,
         Thumbnail,
         Body,
         Left,
         Right,
         Text,
         Button } from 'native-base'
import { responsiveWidth,
         responsiveHeight,
         responsiveFontSize } from 'react-native-responsive-dimensions';

import { SearchStore,
         QuestStore } from '../mobx';
import { observer } from 'mobx-react';
import images from '../../assets/img/images'

@observer

export default class Todo extends React.Component {
  constructor(props) {
    super(props)
  }

  render () {

    var results = SearchStore.results.map((item, i) => {
      return (
        <ListItem
          avatar
          key={i}
          style={styles.item}
          button
          onPress={() => { this.getQuest(item) }}>
            <Left>
              <Thumbnail square small source={images['conversation']} />
            </Left>
            <Body>
              <Text style={styles.title}>{ item.title }</Text>
              <Text
                note style={styles.description}>
                  { item.full_name }
              </Text>
            </Body>
            <Right>
              <Text
                note style={styles.status}>
                  { item.is_answered ? "Answered": "Unanswered" }
              </Text>
            </Right>
        </ListItem>
      );
    }, this);

    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
            { results }
        </ScrollView>
      </View>
    )
  }

  getQuest = (quest) => {
    QuestStore.setCurrentQuest(quest, this.props.navigation);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E7ECEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
    width: responsiveWidth(100),
    backgroundColor: "#0b0c10",
  },
  item: {
    backgroundColor: "transparent",
    width: responsiveWidth(90),
  },
  subtitleView: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingTop: 5
  },
  ratingImage: {
    height: 19.21,
    width: 100
  },
  ratingText: {
    paddingLeft: 10,
    color: 'grey'
  },
  title: {
    fontFamily: "Gotham Bold",
    color: "#e5e6e7",
  },
  description: { 
    fontFamily: "Proxima Nova Regular",
    color: "#e5e6e7",
  },
  status: {
    fontFamily: "Proxima Nova Light",
    color: "#c5c6c7",
  },
});
