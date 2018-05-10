import React from 'react';
import { StyleSheet,
         View,
         ScrollView,
         KeyboardAvoidingView } from 'react-native';
import { responsiveHeight,
         responsiveWidth,
         responsiveFontSize } from 'react-native-responsive-dimensions';
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
         Icon } from 'native-base';
import { observer } from 'mobx-react';
import moment from 'moment';

@observer

export default class Reply extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
      error: "",
      answer_input: "",
      comment_input: "",
      loading: false,
    }
  };

  render() {
    return (
      <CardItem bordered transparent>
        <View>
          <Text style={styles.full_name}>{ this.props.reply.full_name }</Text>
          <Text style={styles.username} note>{ "@" + this.props.reply.username } &#183; { moment(this.props.reply.date_created).fromNow() }</Text>
          <Text style={styles.description}>&#183; { this.props.reply.description }</Text>
        </View>
      </CardItem>
    );
  }
}

const styles = StyleSheet.create({

  name: {
    flexDirection: "row",
  },
  full_name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  username: {
    fontSize: 14,
  },
  readMore: {
    color: "blue",
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  description: {
    fontSize: 16,
    marginLeft: 5,
  },
});
