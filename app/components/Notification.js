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
import { observer } from 'mobx-react';
import { NotificationStore } from '../mobx';
import moment from 'moment';

@observer

export default class Notification extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    }
  }

  componentDidMount() {
    NotificationStore.initNotifications()
  }

  render () {
    var notifications = NotificationStore.notifications.map((item, i) => {
      return (
        <ListItem
          avatar
          key={i}
          style={styles.item}
          button
          onPress={() => { this.getQuest(item.quest_id) }}>
            <Left>
              <Thumbnail small source={{uri:this.state.avatar_url}} />
            </Left>
            <Body>
              <Text
                note>
                  { item.description }
              </Text>
            </Body>
            <Right>
              <Text
                note>
                  { moment(item.date_created).fromNow() }
              </Text>
            </Right>
        </ListItem>
      );
    }, this);

    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
            { notifications }
        </ScrollView>
      </View>
    )
  }

  getQuest = (quest_id) => {
    NotificationStore.getQuest(quest_id, this.props.navigation);
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
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  item: {
    marginLeft: 0,
    backgroundColor: "white",
    width: responsiveWidth(100)
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
  }
});
