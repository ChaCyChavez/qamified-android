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
                note
                style={styles.description}>
                  { item.description }
              </Text>
            </Body>
            <Right>
              <Text
                note
                style={styles.time}>
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
    backgroundColor: "#0b0c10",
  },
  item: {
    marginLeft: 0,
    backgroundColor: "#1f2833",
    width: responsiveWidth(100)
  },
  description: {
    fontFamily: "Proxima Nova Regular",
    color: "#c5c6c7",
    fontSize: 16,
  },
  time: {
    fontFamily: "Proxima Nova Light",
    color: "#c5c6c7",
    fontSize: 14,
  }
});
