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
import { observer } from 'mobx-react';
import { SolutionStore,
         UserStore,
         QuestStore } from '../mobx';

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
    if(this.props.solution.reply) {
      var reply = this.props.solution.reply.map(function(item, index) {
        return (
          <Reply reply={item} key={index}/>
        );
      }, this);
    }

    const isCorrect = (is_correct) => {
      if (is_correct) {
        return (<Icon name="ios-checkmark" size={32}/>);
      }
    };

    return (
      <Card>
        <CardItem>
          <Left>
            <Thumbnail
              small
              source={{ uri:this.state.avatar_url }} />
                <Body>
                  <View>
                    <Text style={styles.full_name}>{ this.props.solution.full_name }</Text>
                    <Text style={styles.username} note>{ "@" + this.props.solution.username } &#183; { this.props.solution.date_created }</Text>
                  </View>
                </Body>
          </Left>
        </CardItem>
        <CardItem>
          <Text style={styles.description}>{ this.props.solution.description }</Text>
        </CardItem>
        <CardItem>
          <Left>
            { isCorrect(this.props.solution.is_correct) }
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
            <Text>{ this.props.solution.votes }</Text>
          </Left>
        </CardItem>
          { reply } 
        <CardItem>
          <Item style={styles.addComment}>
            <Input 
                value={SolutionStore.reply}
                style={styles.answerInput}
                multiline={true}
                placeholder="Add comment"
                onChangeText={(input) => {SolutionStore.reply = input}}/>
            <Icon 
              name="ios-send"
              onPress={ () => this.postReply(this.props.solution._id) }/>
          </Item>
        </CardItem>
      </Card>
    );
  }

  postReply = (solution_id) => {
    var currDate = new Date()
    var reply = {
      solution_id: solution_id,
      date_created: currDate.getTime(),
      description: SolutionStore.reply,
      user_id: UserStore.user.id,
      username: UserStore.user.username,
      full_name: UserStore.fullName,
    }
    SolutionStore.postReply(reply, this.props.solution)
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
    fontSize: 16,
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
    fontSize: 18,
  },
});
