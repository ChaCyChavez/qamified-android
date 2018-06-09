import React from 'react'
import { StyleSheet,
         View,
         ScrollView,
         KeyboardAvoidingView } from 'react-native'
import { responsiveHeight,
         responsiveWidth,
         responsiveFontSize } from 'react-native-responsive-dimensions'
import { Text,
         Left,
         Right,
         Thumbnail,
         Body,
         Card,
         CardItem,
         Button,
         Item,
         Input,
         Icon } from 'native-base'
import { observer } from 'mobx-react'
import moment from 'moment'
import { UserProfileStore,
         UserStore } from '../mobx'
import firebase from 'react-native-firebase'

@observer

export default class Reply extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      error: "",
      answer_input: "",
      comment_input: "",
      loading: false,
    }
  }

  render() {
    return (
      <CardItem bordered style={{backgroundColor: "transparent"}}>
        <View>
          <Text style={styles.full_name} button onPress={() => this.setUser(this.props.user_id)}>{ this.props.reply.full_name }</Text>
          <Text style={styles.username} note>{ "@" + this.props.reply.username } &#183; { moment(this.props.reply.date_created).fromNow() }</Text>
          <Text style={styles.description}>&#183; { this.props.reply.description }</Text>
        </View>
      </CardItem>
    )
  }

  setUser = (user_id) => {
    UserStore.logEvent('VIEW_USER')
    UserProfileStore.setUser(user_id, this.props.navigation)
  }
}

const styles = StyleSheet.create({

  name: {
    flexDirection: "row",
  },
  full_name: {
    fontSize: 16,
    fontFamily: "Gotham Bold",
    color: "#c5c6c7",
  },
  username: {
    fontSize: 14,
    fontFamily: "Proxima Nova Light",
    color: "#e5e6e7",
  },
  description: {
    fontSize: 16,
    marginLeft: 5,
    fontFamily: "Proxima Nova Regular",
    color: "#c5c6c7",
  },
})
