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
import firebase from 'react-native-firebase';
import { observer } from 'mobx-react';
import Store from '../mobx/Store.js';

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
    <View>
      <CardItem bordered transparent>
        <Text style={styles.description}>{ this.props.item.description }</Text>
        <View style={styles.name}>
          <Text style={styles.full_name}> - { this.props.item.full_name }</Text>
          <Text style={styles.username} note>{ "@" + this.props.item.username }</Text>
        </View>
      </CardItem>
    </View>
    );
  }
}

const styles = StyleSheet.create({

  name: {
    flexDirection: "row",
  },
  full_name: {
    fontSize: 14,
    fontWeight: "bold",
  },
  username: {
    fontSize: 14,
    marginLeft: 5,
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
    marginLeft: 20,
  },
});
