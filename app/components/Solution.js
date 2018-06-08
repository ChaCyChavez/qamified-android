import React from 'react'
import { StyleSheet,
         View,
         ScrollView,
         KeyboardAvoidingView,
         Alert } from 'react-native'
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
import Reply from './Reply.js'
import { observer } from 'mobx-react'
import { SolutionStore,
         UserStore,
         QuestStore,
         UserProfileStore } from '../mobx'
import moment from 'moment'
import images from '../../assets/img/images'
import firebase from 'react-native-firebase'
import Markdown from 'react-native-markdown-renderer'

@observer

export default class Solution extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      reply: "",
    }
  }

  render() {
    var reply = []
    if(this.props.solution.reply) {
      var reply = this.props.solution.reply.map(function(item, index) {
        return (
          <Reply reply={item} key={index} navigation={this.props.navigation}/>
        )
      }, this)
    }

    const isCorrect = (is_correct) => {
      if (is_correct) {
        return (<Icon name="ios-checkmark-circle" style={{fontSize: 24, color: "#66fcf1"}}/>)
      }
    }

    return (
      <Card style={styles.questions}>
        { this.renderUserInfo() }
        <CardItem style={{backgroundColor: 'transparent'}}>
          <View>
          { isCorrect(this.props.solution.is_correct) }
          <Markdown style={markdownStyles}>{ this.props.solution.description }</Markdown>
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

  renderUserInfo = () => {
    if(UserProfileStore.open) {
      return (
        <CardItem style={{backgroundColor: 'transparent'}}>
          <Left>
            <Thumbnail
              small
              source={images[this.props.solution.user_avatar]} />
                <Body>
                  <View>
                    <Text style={styles.full_name}>{ this.props.solution.full_name }</Text>
                    <Text style={styles.username} note>{ "@" + this.props.solution.username } &#183 { moment(this.props.solution.date_created).fromNow() }</Text>
                  </View>
                </Body>
          </Left>
        </CardItem>
      )
    }
    return (
      <CardItem style={{backgroundColor: 'transparent'}}
        button onPress={() => this.setUser(this.props.user_id)}>
        <Left>
          <Thumbnail
            small
            source={images[this.props.solution.user_avatar]} />
              <Body>
                <View>
                  <Text style={styles.full_name}>{ this.props.solution.full_name }</Text>
                  <Text style={styles.username} note>{ "@" + this.props.solution.username } &#183 { moment(this.props.solution.date_created).fromNow() }</Text>
                </View>
              </Body>
        </Left>
      </CardItem>
    )
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

    firebase.analytics()
      .logEvent('POST_REPLY', {})

    SolutionStore.postReply(reply, this.props.solution, this)
  }

  upvote = solution => {
    firebase.analytics()
      .logEvent('UPVOTE_SOLUTOION', {})

    SolutionStore.upvoteSolution(solution)
  }

  downvote = solution => {
    firebase.analytics()
      .logEvent('DOWNVOTE_SOLUTION', {})

    SolutionStore.downvoteSolution(solution)
  }

  markAsSolution = solution => {
    firebase.analytics()
      .logEvent('MARK_SOLUTION', {})

    SolutionStore.markAsSolution(solution)
  }

  delete = solution => {
    Alert.alert(
      'Remove Solution',
      'Are you sure?',
      [
        {text: 'CANCEL', onPress: () => {}},
        {text: 'YES', onPress: () => {
            firebase.analytics()
              .logEvent('DELETE_SOLUTION', {})
            SolutionStore.deleteSolution(solution)
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
})


export const markdownStyles = StyleSheet.create({
  root: {},
  view: {},
  codeBlock: {
    width: responsiveWidth(90),
    borderColor: 'transparent',
    backgroundColor: "#3f4853",
    padding: 10,
    borderRadius: 4,
    fontFamily: 'Courier Prime',
    fontSize: 18,
    color: "#e5e6e7",
  },
  codeInline: {
    borderColor: 'transparent',
    backgroundColor: "#3f4853",
    padding: 10,
    borderRadius: 4,
    fontFamily: 'Courier Prime',
    fontSize: 18,
    color: "#e5e6e7",
  },
  del: {
    backgroundColor: '#000000',
  },
  em: {
    fontStyle: 'italic',
  },
  headingContainer: {
    flexDirection: 'row',
  },
  heading: {
    // fontFamily: "Gotham Bold"
  },
  heading1: {
    fontSize: 32,
    fontFamily: "Gotham Bold"
  },
  heading2: {
    fontSize: 24,
  },
  heading3: {
    fontSize: 18,
  },
  heading4: {
    fontSize: 16,
  },
  heading5: {
    fontSize: 13,
  },
  heading6: {
    fontSize: 11,
  },
  hr: {
    backgroundColor: '#000000',
    height: 1,
  },
  blockquote: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    margin: 20,
    backgroundColor: "#3f4853",
  },
  inlineCode: {
    borderRadius: 3,
    borderWidth: 1,
    fontFamily: 'Courier Prime',
    fontWeight: 'bold',
    fontSize: 18,
    color: "#e5e6e7",
  },
  list: {},
  listItem: {
    flex: 1,
    flexWrap: 'wrap',
    // backgroundColor: 'green',
  },
  listUnordered: {},

  listUnorderedItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  listUnorderedItemText: {
    fontSize: 20,
    lineHeight: 20,
  },

  listOrdered: {},
  listOrderedItem: {
    flexDirection: 'row',
  },

  listOrderedItemText: {
    fontWeight: 'bold',
    lineHeight: 20,
  },
  paragraph: {
    marginTop: 10,
    marginBottom: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  hardbreak: {
    width: '100%',
    height: 1,
  },
  strong: {
    fontWeight: 'bold',
  },
  table: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 3,
  },
  tableHeader: {},
  tableHeaderCell: {
    flex: 1,
    // color: '#000000',
    padding: 5,
    // backgroundColor: 'green',
  },
  tableRow: {
    borderBottomWidth: 1,
    borderColor: '#000000',
    flexDirection: 'row',
  },
  tableRowCell: {
    flex: 1,
    padding: 5,
  },
  text: {
    fontSize: 18,
    fontFamily: "Proxima Nova Regular",
    color: "#e5e6e7",
  },
  strikethrough: {
    textDecorationLine: 'line-through',
  },
  link: {
    textDecorationLine: 'underline',
  },
  blocklink: {
    flex: 1,
    borderColor: '#000000',
    borderBottomWidth: 1,

  },
  u: {
    borderColor: '#000000',
    borderBottomWidth: 1,
  },
  image: {
    flex: 1,
  },
})