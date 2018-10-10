import React from 'react'
import { StyleSheet,
         TextInput,
         View,
         ScrollView,
         RefreshControl } from 'react-native'
import { List,
         ListItem,
         Thumbnail,
         Body,
         Left,
         Right,
         Text,
         Button,
         Icon } from 'native-base'
import { responsiveWidth,
         responsiveHeight,
         responsiveFontSize } from 'react-native-responsive-dimensions'
import { observer } from 'mobx-react'
import { NotificationStore,
         UserStore } from '../mobx'
import moment from 'moment'
import images from '../../assets/img/images'

@observer

export default class Notification extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    NotificationStore.initNotifications()
  }

  _onRefresh () {
    NotificationStore.initNotifications()
  }

  render () {
    var counter = 0
    var notifications = NotificationStore.notifications.map((item, i) => {
      counter += 1
      return (
        <ListItem
          avatar
          key={i}
          style={item.is_read ? styles.item : styles.item_unread}
          button
          onPress={() => { this.getQuest(item) }}>
            <Left>
              <Thumbnail square small source={images['conversation']} />
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
      )
    }, this)

    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={NotificationStore.loading}
              onRefresh={this._onRefresh.bind(this)}
            />}
        >
            { counter > 0 ? notifications : <View>
                <Icon style={{textAlign: 'center', fontSize: 40, marginTop: 10, color: "#252627"}} name="ios-sad" />
                <Text style={styles.noNotification}>Oops, there's nothing to see here.</Text>
                </View> }
        </ScrollView>
      </View>
    )
  }

  getQuest = (quest_id) => {
    UserStore.logEvent('VIEW_QUEST')
    NotificationStore.getQuest(quest_id, this.props.navigation)
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
    paddingLeft: 10,
    backgroundColor: "#1f2833",
    width: responsiveWidth(100)
  },
  item_unread: {
    marginLeft: 0,
    paddingLeft: 10,
    backgroundColor: "#3f4853",
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
  },
  noNotification: {
    textAlign: 'center',
    fontFamily: "Gotham Bold",
    color: "#252627",
    fontSize: 28,
    padding: 10,
  }

})
