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
import Reply from './Reply.js';

import firebase from 'react-native-firebase';
import { observer } from 'mobx-react';
import Store from '../mobx/Store.js';

@observer

export default class Solution extends React.Component {

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
    var reply = []
    if(this.props.item.reply) {
      var reply = this.props.item.reply.map(function(item, index) {
        return (
          <Reply item={item} key={index}/>
        );
      }, this);
    }

    return (
      <Card>
        <CardItem>
          <Left>
            <Thumbnail
              small
              source={{ uri:this.state.avatar_url }} />
                <Body>
                  <View style={styles.name}>
                    <Text style={styles.full_name}>{ this.props.item.full_name }</Text>
                    <Text style={styles.username} note>{ "@" + this.props.item.username }</Text>
                  </View>
                </Body>
          </Left>
        </CardItem>
        <CardItem>
          <Text>{ this.props.item.description }</Text>
        </CardItem>
        <CardItem>
          <Left>
            <Button transparent>
              <Icon
                name="ios-arrow-up"
                size={32}/>
            </Button>
            <Button transparent>
              <Icon 
                name="ios-arrow-down"
                size={32}/>
            </Button>
            <Text>{ this.props.item.votes }</Text>
          </Left>
        </CardItem>
        <Card transparent>
          { reply }
          <Item style={styles.addComment}>
            <Input 
                style={styles.answerInput}
                multiline={true}
                placeholder="Add comment"
                underlineColorAndroid="transparent"
                onChangeText={(input) => this.setState({comment_input: input})}/>
            <Icon 
              name="ios-send"
              size={64}
              onPress={ () => this.postReply(this.props.item.id) }/>
          </Item>
        </Card>
      </Card>
    );
  }

  postReply = (id) => {
    this.setState({loading: true});
    var currDate = new Date()
    var reply = {
      date_created: currDate.getTime(),
      description: this.state.comment_input,
      user_id: Store.user.id,
      username: Store.user.username,
      full_name: "{0} {1}. {2}".format(Store.user.first_name, Store.user.middle_name.charAt(0), Store.user.last_name),
    }
    this.state.comment_input.clear();
    
    firebase.database()
      .ref('posts/' + Store.questState.current_quest.id + "/solutions/" + id + "/reply")
      .push().set(reply)
      .then(() => {
        this.setState({error: "", loading: false, comment_input: ""})
      })
      .catch((error) => {
        this.setState({error: error.message, loading: false})
      })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E7ECEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    backgroundColor: "#222222",
    margin: 0,
  },
  searchBar: {
    width: responsiveWidth(75),
    height: 35,
    fontSize: 16,
    backgroundColor: 'white',
    padding: 8,
    color: '#111111',
  },
  search: {
    margin: 0,
  },
  headerIcon: {
    width: responsiveWidth(10),
  },
  scrollView: { 
    flex: 1,
    width: responsiveWidth(100),
    backgroundColor: "#dddddd",
  },
  questions: {
    elevation: 1,
    marginBottom: 12,
    padding: 20,
    backgroundColor: "white",
  },
  name: {
    flexDirection: "row",
  },
  full_name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  username: {
    fontSize: 18,
    marginLeft: 5,
  },
  addComment: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  answerInput: {
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
    height: 50,
  },
});
