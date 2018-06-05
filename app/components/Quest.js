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
         FeedStore,
         UserProfileStore } from '../mobx';
import moment from 'moment';
import images from '../../assets/img/images';
import firebase from 'react-native-firebase'

@observer

export default class Quest extends React.Component {

  constructor(props) {
    super(props);

    this.postSolution = this.postSolution.bind(this)
    this.state = {
      solution: "",
    }
  };

  render() {

    let itemsLength = QuestStore.current_solutions ? QuestStore.current_solutions.length : 0;

    const status = (isAnswered, isDuplicate) => {
      return (<Text note style={styles.status}>{isAnswered ? "Answered" : "Unanswered"}{isDuplicate ? " · Duplicate" : ""}</Text>);
    };

    var solutions = []
    if(itemsLength > 0) {
      solutions = QuestStore.current_solutions.map((item, index) => {
        return (
          <Solution solution={item} key={index} navigation={this.props.navigation}/>
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
              { status(QuestStore.current_quest.is_answered, QuestStore.current_quest.is_duplicate) }
            </CardItem>
            { this.renderUserInfo() }
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
              <Body>
              </Body>
              { this.renderFlagButton() }
              <Right>
                { this.renderDeleteQuestButton() }
              </Right>
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
                  source={images[UserStore.user.avatar]} />
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

  renderUserInfo = () => {
    if(UserProfileStore.open) {
      return (
        <CardItem style={{backgroundColor: 'transparent'}}>
          <Left>
            <Thumbnail
              small 
              source={images[QuestStore.current_quest.user_avatar]} />
                <Body>
                  <View>
                    <Text style={styles.full_name} ellipsizeMode="tail" numberOfLines={1}>{ QuestStore.current_quest.full_name }</Text>
                    <Text style={styles.username} note ellipsizeMode="tail" numberOfLines={1}>{ "@" + QuestStore.current_quest.username } &#183; { moment(QuestStore.current_quest.date_created).fromNow() }</Text>
                  </View>
                </Body>
          </Left>
        </CardItem>
      )
    }
    return (
      <CardItem style={{backgroundColor: 'transparent'}}
        button onPress={() => this.setUser(item.user_id)}>
        <Left>
          <Thumbnail
            small 
            source={images[QuestStore.current_quest.user_avatar]} />
              <Body>
                <View>
                  <Text style={styles.full_name} ellipsizeMode="tail" numberOfLines={1}>{ QuestStore.current_quest.full_name }</Text>
                  <Text style={styles.username} note ellipsizeMode="tail" numberOfLines={1}>{ "@" + QuestStore.current_quest.username } &#183; { moment(QuestStore.current_quest.date_created).fromNow() }</Text>
                </View>
              </Body>
        </Left>
      </CardItem>
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

  renderFlagButton = () => {
    if(!(QuestStore.current_quest.is_duplicate)) {
      return (
        <Button
          bordered
          style={{borderColor: 'transparent'}}
          onPress={() => this.flagAsDuplicate()}>
          <Icon 
            name="ios-flag" 
            style={{fontSize: 24, color: "#66fcf1"}}/>
        </Button>
      )
    }
  }

  renderDeleteQuestButton = () => {
    if(QuestStore.current_quest.user_id == UserStore.user._id) {
      return (
        <Button
          bordered
          style={{borderColor: 'transparent'}}
          onPress={() => this.delete(QuestStore.current_quest)}>
          <Icon 
            name="ios-trash" 
            style={{fontSize: 24, color: "#66fcf1"}}/>
        </Button>
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
      reply: [],
      user_avatar: UserStore.user.avatar
    }

    firebase.analytics()
      .logEvent('POST_SOLUTION', {})

    QuestStore.postSolution(solution, this);
  };

  upvote = (quest) => {
    firebase.analytics()
      .logEvent('UPVOTE_QUEST', {})

    FeedStore.upvoteQuest(quest)
  };

  downvote = (quest) => {
    firebase.analytics()
      .logEvent('DOWNVOTE_QUEST', {})

    FeedStore.downvoteQuest(quest)
  }

  delete = (quest) => {
    Alert.alert(
      'Remove Quest',
      'Are you sure?',
      [
        {text: 'CANCEL', onPress: () => {}},
        {text: 'YES', onPress: () => {
            firebase.analytics()
              .logEvent('DELETE_QUEST', {})
            QuestStore.deleteQuest(this.props.navigation)
          }
        },
      ],
      { cancelable: true }
    )
  }

  flagAsDuplicate = () => {
    Alert.alert(
      'Flag as duplicate',
      'Are you sure?',
      [
        {text: 'CANCEL', onPress: () => {}},
        {text: 'YES', onPress: () => {
            firebase.analytics()
              .logEvent('FLAG_QUEST', {})
            QuestStore.flagAsDuplicate()
          }
        },
      ],
      { cancelable: true }
    )
  }

  setUser = (user_id) => {
    firebase.analytics()
      .logEvent('VIEW_USER', {})

    UserProfileStore.setUser(user_id, this.props.navigation)
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
