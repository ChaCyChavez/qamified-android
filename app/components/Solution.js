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
import moment from 'moment';

@observer

export default class Solution extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
      reply: "",
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
        return (<Icon name="ios-checkmark-circle" style={{fontSize: 24, color: "#66fcf1"}}/>);
      }
    };

    return (
      <Card style={styles.questions}>
        <CardItem style={{backgroundColor: 'transparent'}}>
          <Left>
            <Thumbnail
              small
              source={{ uri:this.state.avatar_url }} />
                <Body>
                  <View>
                    <Text style={styles.full_name}>{ this.props.solution.full_name }</Text>
                    <Text style={styles.username} note>{ "@" + this.props.solution.username } &#183; { moment(this.props.solution.date_created).fromNow() }</Text>
                  </View>
                </Body>
          </Left>
        </CardItem>
        <CardItem style={{backgroundColor: 'transparent'}}>
          <View>
          <Text style={styles.description}> { isCorrect(this.props.solution.is_correct) } { this.props.solution.description }</Text>
          </View>
        </CardItem>
        <CardItem style={{backgroundColor: 'transparent'}}>
          <Left>
            <Button
              bordered
              style={{borderColor: 'transparent'}}
              onPress={() => this.upvote(this.props.solution)}>
              <Icon
                name="ios-arrow-up"
                style={{fontSize: 28, color: this.isUpvoted(this.props.solution.upvote) ? 'green' : 'gray'}}/>
            </Button>
            <Button
              bordered
              style={{borderColor: 'transparent'}}
              onPress={() => this.downvote(this.props.solution)}>
              <Icon 
                name="ios-arrow-down"
                style={{fontSize: 28, color: this.isDownvoted(this.props.solution.downvote) ? 'red' : 'gray'}}/>
            </Button>
            <Text style={styles.votes}>{ this.props.solution.votes }</Text>
          </Left>
          <Body>
          </Body>
            { this.renderCheckSolutionButton(QuestStore.current_quest, this.props.solution) }
          <Right>
            { this.renderDeleteSolutionButton(this.props.solution) }
          </Right>
        </CardItem>
          { reply } 
        <CardItem style={{backgroundColor: 'transparent'}}>
          <Item style={styles.addComment}>
            <Input
                value={this.state.reply}
                style={styles.replyInput}
                multiline={true}
                placeholder="Add comment"
                placeholderTextColor="#959697"
                onChangeText={(input) => this.setState({reply: input})}/>
            { this.renderReplyButton() }
          </Item>
        </CardItem>
      </Card>
    )
  }

  completeField = () => {
    return this.state.reply ? true : false
  }

  renderReplyButton = () => {
    if(!this.completeField() || SolutionStore.loading) {
      return (
        <Icon 
          name="ios-send"
          style={{fontSize: 32, color: "#b2d8d8"}}/>
      )
    }
    return(
      <Icon 
        name="ios-send"
        onPress={ () => this.postReply(this.props.solution._id) }
        style={{fontSize: 32, color: "#66fcf1"}}/>
    )
  }
  isUpvoted = (upvote) => {
    if(!upvote) {
      return false
    } else if(upvote.includes(UserStore.user._id)) {
      return true
    } else {
      return false
    }
  }

  isDownvoted = (downvote) => {
    if(!downvote) {
      return false
    } else if(downvote.includes(UserStore.user._id)) {
      return true
    } else {
      return false
    }
  }

  renderCheckSolutionButton = (quest, solution) => {
    if(!quest.is_answered && quest.user_id == UserStore.user._id) {
      return (
        <Button
          bordered
          style={{borderColor: 'transparent'}}
          onPress={() => this.markAsSolution(solution)}>
          <Icon 
            name="ios-checkmark" 
            style={{fontSize: 34, color: "#66fcf1"}}/>
        </Button>
      )
    }
  }

  renderDeleteSolutionButton = (solution) => {
    if(solution.user_id == UserStore.user._id) {
      return (
        <Button
          bordered
          style={{borderColor: 'transparent'}}
          onPress={() => this.delete(solution)}>
          <Icon 
            name="ios-trash" 
            style={{fontSize: 24, color: "#66fcf1"}}/>
        </Button>
      )
    }
  }

  postReply = solution_id => {
    var currDate = new Date()
    var reply = {
      solution_id: solution_id,
      date_created: moment().format(),
      description: this.state.reply,
      user_id: UserStore.user._id,
      username: UserStore.user.username,
      full_name: UserStore.fullName,
    }
    SolutionStore.postReply(reply, this.props.solution, this)
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
  scrollView: { 
    flex: 1,
    width: responsiveWidth(100),
    backgroundColor: "#0b0c10",
  },
  questions: {
    backgroundColor: "#1f2833",
    borderColor: 'transparent',
  },
  name: {
    flexDirection: "row",
  },
  full_name: {
    fontSize: 18,
    fontFamily: "Gotham Bold",
    color: "#c5c6c7",
  },
  username: {
    fontSize: 16,
    fontFamily: "Proxima Nova Light",
    color: "#e5e6e7",
  },
  addComment: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  replyInput: {
    fontSize: 14,
    fontFamily: "Proxima Nova Regular",
    color: "#e5e6e7"
  },
  description: {
    fontSize: 18,
    fontFamily: "Proxima Nova Regular",
    color: "#c5c6c7",
  },
  votes: {
    fontFamily: "Proxima Nova Regular",
    color: "#e5e6e7",
  }
});
