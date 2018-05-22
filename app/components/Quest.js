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
         Icon,
         Spinner } from 'native-base';
import Solution from './Solution.js';
import { observer } from 'mobx-react';
import { QuestStore,
         UserStore,
         FeedStore } from '../mobx';
import moment from 'moment';

@observer

export default class Quest extends React.Component {

  constructor(props) {
    super(props);

    this.postSolution = this.postSolution.bind(this)
    this.state = {
      solution: "",
      avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    }
  };

  render() {

    let itemsLength = QuestStore.current_solutions ? QuestStore.current_solutions.length : 0;

    const isAnswered = (isAnswered) => {
      return (isAnswered ? <Text note style={styles.status}>Answered</Text> : <Text note style={styles.status}>Unanswered</Text>);
    };

    var solutions = []
    if(itemsLength > 0) {
      solutions = QuestStore.current_solutions.map((item, index) => {
        return (
          <Solution solution={item} key={index}/>
        );
      }, this);
    }

    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
        <KeyboardAvoidingView style={{flexGrow: 1}} >
          <Card style={styles.questions}>
            <CardItem style={{backgroundColor: 'transparent'}}>
              <Text
                style={styles.title}>
                  {QuestStore.current_quest.title}
              </Text>
            </CardItem>
            <CardItem style={{backgroundColor: 'transparent'}}>
              { isAnswered(QuestStore.current_quest.is_answered) }
            </CardItem>
            <CardItem style={{backgroundColor: 'transparent'}}>
              <Left>
                <Thumbnail
                  small 
                  source={{ uri:this.state.avatar_url }} />
                    <Body>
                      <View>
                        <Text style={styles.full_name} ellipsizeMode="tail" numberOfLines={1}>{ QuestStore.current_quest.full_name }</Text>
                        <Text style={styles.username} note ellipsizeMode="tail" numberOfLines={1}>{ "@" + QuestStore.current_quest.username } &#183; { moment(QuestStore.current_quest.date_created).fromNow() }</Text>
                      </View>
                    </Body>
              </Left>
            </CardItem>
            <CardItem style={{backgroundColor: 'transparent'}}>
              <Text style={styles.description}>{ QuestStore.current_quest.description }</Text>
            </CardItem>
            <CardItem style={{backgroundColor: 'transparent'}}>
              <Left>
                <Button
                  bordered
                  style={{borderColor: 'transparent'}}
                  onPress={() => this.upvote(QuestStore.current_quest)}>
                  <Icon
                    name="ios-arrow-up"
                    style={{fontSize: 28, color: this.isDownvoted(QuestStore.current_quest.upvote) ? 'green' : 'gray'}}/>
                </Button>
                <Button
                  bordered
                  style={{borderColor: 'transparent'}}
                  onPress={() => this.downvote(QuestStore.current_quest)}>
                  <Icon
                    name="ios-arrow-down"
                    style={{fontSize: 28, color: this.isDownvoted(QuestStore.current_quest.downvote) ? 'red' : 'gray'}}/>
                </Button>
                <Text style={styles.votes}>{ QuestStore.current_quest.votes }</Text>
              </Left>
              { this.renderDeleteQuestButton() }
            </CardItem>
          </Card>
          <Card style={styles.questions}>
            <CardItem style={styles.spinCon}>
              { QuestStore.initializing ? <Spinner color='#66fcf1' /> : <Text style={styles.answers}>{ itemsLength } Answer/s</Text> }
            </CardItem>
          </Card>
          { QuestStore.initializing ? <View></View> : solutions }
          <Card style={styles.questions}>
            <CardItem style={{backgroundColor: "transparent"}}>
              <Left>
                <Thumbnail  
                  small
                  source={{ uri:this.state.avatar_url }} />
                    <Body>
                      <View>
                        <Text style={styles.full_name}>{ UserStore.fullName }</Text>
                        <Text style={styles.username} note>{ "@" + UserStore.user.username }</Text>
                      </View>
                    </Body>
              </Left>
            </CardItem>
            <CardItem style={{backgroundColor: "transparent"}}>
              <Item>
                <Input
                  style={styles.answerInput}
                  value={this.state.solution}
                  multiline={true}
                  placeholder="Post answer..."
                  placeholderTextColor="#959697"
                  onChangeText={(input) => this.setState({solution: input})}/>
              </Item>
            </CardItem>
            <CardItem style={{backgroundColor: "transparent"}}>
              { this.renderPostButton() }
            </CardItem>
          </Card>
        </KeyboardAvoidingView> 
        </ScrollView>
      </View>
    );
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

  renderDeleteQuestButton = () => {
    if(QuestStore.current_quest.user_id == UserStore.user._id) {
      return (
        <Right>
          <Button
            bordered
            style={{borderColor: 'transparent'}}
            onPress={() => this.delete(QuestStore.current_quest)}>
            <Icon 
              name="ios-trash" 
              style={{fontSize: 24, color: "#66fcf1"}}/>
          </Button>
        </Right>
      )
    }
  }

  completeField = () => {
    return this.state.solution ? true : false
  }

  renderPostButton = () => {
    if(QuestStore.loading) {
      return (
        <Button
          transparent
          style={styles.disabledPostButton}
          disabled>
            <Text
             uppercase={false}
             style={{color: "white", fontFamily: "Proxima Nova Bold"}}>
              Submitting...
            </Text>
        </Button>
      )
    }
    else if(!this.completeField()) {
      return (
        <Button
          transparent
          style={styles.disabledPostButton}
          disabled>
            <Text
             uppercase={false}
             style={{color: "white", fontFamily: "Proxima Nova Bold"}}>
              Submit
            </Text>
        </Button>
      )
    }
    return (
      <Button
        transparent
        style={styles.postButton}
        onPress={ this.postSolution }>
          <Text
            uppercase={false}
            style={{color: "white", fontFamily: "Proxima Nova Bold"}}>
              Submit
          </Text>
      </Button>
    )
  };

  postSolution = () => {
    var currDate = new Date()
    var solution = {
      quest_id: QuestStore.current_quest._id,
      date_created: moment().format(),
      is_correct: false,
      description: this.state.solution,
      votes: 0,
      user_id: UserStore.user._id,
      username: UserStore.user.username,
      full_name: UserStore.fullName,
      reply: []
    }
    QuestStore.postSolution(solution, this);
  };

  upvote = (quest) => {
    FeedStore.upvoteQuest(quest)
  };

  downvote = (quest) => {
    FeedStore.downvoteQuest(quest)
  }

  delete = (quest) => {
    Alert.alert(
      'Remove Quest',
      'Are you sure?',
      [
        {text: 'CANCEL', onPress: () => {}},
        {text: 'YES', onPress: () => QuestStore.deleteQuest(this.props.navigation)},
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
  spinCon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  answers: {
    fontSize: 18,
    fontFamily: "Proxima Nova Regular",
    color: "#e5e6e7",
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
  status: {
    fontFamily: "Proxima Nova Light",
    fontSize: 16,
    color: "#c5c6c7",
  },
  full_name: {
    fontSize: 18,
    fontFamily: "Gotham Bold",
    color: "#e5e6e7",
  },
  username: {
    fontSize: 16,
    fontFamily: "Proxima Nova Light",
    color: "#c5c6c7",
  },
  title: {
    fontFamily: "Gotham Bold",
    fontSize: 24,
    color: "#e5e6e7",
  },
  answerInput: {
    fontSize: 18,
    fontFamily: "Proxima Nova Regular",
    color: "#e5e6e7",
  },
  description: {
    fontSize: 18,
    fontFamily: "Proxima Nova Regular",
    color: "#e5e6e7",
  },
  votes: {
    fontFamily: "Proxima Nova Regular",
    color: "#e5e6e7",
  },
  postButton: {
    justifyContent: 'center',
    width: responsiveWidth(90),
    backgroundColor: "#45a29e",
    borderColor: 'transparent',
  },
  disabledPostButton: {
    justifyContent: 'center',
    width: responsiveWidth(90),
    backgroundColor: "#b2d8d8",
    borderColor: 'transparent',
  },
});
