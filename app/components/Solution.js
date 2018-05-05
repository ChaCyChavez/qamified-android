import React from 'react';
import { StyleSheet,
         View,
         ScrollView,
         KeyboardAvoidingView,
         Alert } from 'react-native';
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
        return (<Icon name="ios-checkmark-circle" style={{fontSize: 24, color: "green"}}/>);
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
          <View>
          <Text style={styles.description}> { isCorrect(this.props.solution.is_correct) } { this.props.solution.description }</Text>
          </View>
        </CardItem>
        <CardItem>
          <Left>
            <Button
              bordered
              style={{borderColor: 'white'}}
              onPress={() => this.upvote(this.props.solution)}>
              <Icon
                name="ios-arrow-up"
                style={{fontSize: 28, color: this.isUpvoted(this.props.solution.upvote) ? 'green' : 'gray'}}/>
            </Button>
            <Button
              bordered
              style={{borderColor: 'white'}}
              onPress={() => this.downvote(this.props.solution)}>
              <Icon 
                name="ios-arrow-down"
                style={{fontSize: 28, color: this.isDownvoted(this.props.solution.downvote) ? 'red' : 'gray'}}/>
            </Button>
            <Text>{ this.props.solution.votes }</Text>
          </Left>
          <Body>
          </Body>
            { this.renderCheckSolutionButton(this.props.solution) }
          <Right>
            { this.renderDeleteSolutionButton(this.props.solution) }
          </Right>
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
              onPress={ () => this.postReply(this.props.solution._id) }
              style={{fontSize: 32}}/>
          </Item>
        </CardItem>
      </Card>
    );
  }

  isUpvoted = (upvote) => {
    if(!upvote) {
      return false
    } else if(upvote.includes(UserStore.user.id)) {
      return true
    } else {
      return false
    }
  }

  isDownvoted = (downvote) => {
    if(!downvote) {
      return false
    } else if(downvote.includes(UserStore.user.id)) {
      return true
    } else {
      return false
    }
  }

  renderCheckSolutionButton = (solution) => {
    if(solution.is_answered && solution.user_id == UserStore.user.id) {
      return (
        <Button
          bordered
          style={{borderColor: 'white'}}
          onPress={() => this.markAsSolution(solution)}>
          <Icon 
            name="ios-checkmark" 
            style={{fontSize: 34}}/>
        </Button>
      )
    }
  }

  renderDeleteSolutionButton = (solution) => {
    if(solution.user_id == UserStore.user.id) {
      return (
        <Button
          bordered
          style={{borderColor: 'white'}}
          onPress={() => this.delete(solution)}>
          <Icon 
            name="ios-trash" 
            style={{fontSize: 24}}/>
        </Button>
      )
    }
  }

  postReply = solution_id => {
    var currDate = new Date()
    var reply = {
      solution_id: solution_id,
      date_created: currDate.getTime(),
      description: SolutionStore.reply,
      user_id: UserStore.user.id,
      username: UserStore.user.username,
      full_name: UserStore.fullName,
    }
    // console.error(this.props.solution)
    SolutionStore.postReply(reply, this.props.solution)
  };

  upvote = solution => {
    SolutionStore.upvoteSolution(solution)
  };

  downvote = solution => {
    SolutionStore.downvoteSolution(solution)
  }

  markAsSolution = solution => {
    SolutionStore.markAsSolution(solution)
  }

  delete = solution => {
    Alert.alert(
      'Remove Solution',
      'Are you sure?',
      [
        {text: 'CANCEL', onPress: () => {}},
        {text: 'YES', onPress: () => SolutionStore.deleteSolution(solution)},
      ],
      { cancelable: true }
    )
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
