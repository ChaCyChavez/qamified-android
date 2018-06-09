import React from 'react'
import { StyleSheet,
         View,
         ScrollView,
         KeyboardAvoidingView,
         Alert,
         TouchableOpacity,
         Linking } from 'react-native'
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
         Icon,
         Spinner } from 'native-base'
import Solution from './Solution.js'
import { observer } from 'mobx-react'
import { QuestStore,
         UserStore,
         FeedStore,
         UserProfileStore } from '../mobx'
import moment from 'moment'
import images from '../../assets/img/images'
import firebase from 'react-native-firebase'
import Markdown from 'react-native-markdown-renderer'
import Modal from 'react-native-modal'

@observer

export default class Quest extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      solution: "",
    }
  }

  _toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }

  render() {

    let itemsLength = QuestStore.current_solutions ? QuestStore.current_solutions.length : 0

    const status = (isAnswered, isDuplicate, category) => {
      return (<Text note style={styles.status}>{isAnswered ? "Answered" : "Unanswered"}{isDuplicate ? " · Duplicate" : ""} &#183; {category}</Text>)
    }

    var solutions = []
    if(itemsLength > 0) {
      solutions = QuestStore.current_solutions.map((item, index) => {
        return (
          <Solution solution={item} key={index} navigation={this.props.navigation}/>
        )
      }, this)
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
              { status(QuestStore.current_quest.is_answered, QuestStore.current_quest.is_duplicate, QuestStore.current_quest.category) }
            </CardItem>
            { this.renderUserInfo() }
            <CardItem style={{backgroundColor: 'transparent'}}>
              <Markdown style={markdownStyles}>{ QuestStore.current_quest.description }</Markdown>
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
                  <TouchableOpacity style={{position: "absolute", right: 1, top: 1}} onPress={this._toggleModal}>
                    <Icon name="ios-bulb" style={{color: 'white'}}/>
                  </TouchableOpacity>
                  <Modal isVisible={this.state.isModalVisible}>
                    { this.renderModal() }
                  </Modal>
              </Item>
            </CardItem>
            <CardItem style={{backgroundColor: "transparent"}}>
              { this.renderPostButton() }
            </CardItem>
          </Card>
        </KeyboardAvoidingView> 
        </ScrollView>
      </View>
    )
  }

  renderModal = () => {
    return (
    <ScrollView>
      <Card style={{ flex: 1, backgroundColor: "white"}}>
        <CardItem>
          <Text style={styles.tipHeader}>Tip: Posting Solution</Text>
        </CardItem>
        <CardItem>
          <Body style={{width: responsiveWidth(40)}}>
            <Text style={styles.tipContent}>
              {
                `This application supports markdown (lightweight marup language).\n\nExample:\n`
              }
            </Text>
            <Text style={styles.exHeader}>
              Headers
            </Text>
            <Text style={styles.exContent}>
              {
                `# This is an <h1> tag\n## This is an <h2> tag\n###### This is an <h6> tag\n`
              }
            </Text>
            <Text style={styles.exHeader}>
              Emphasis
            </Text>
            <Text style={styles.exContent}>
              {
                `*This text will be italic*\n_This will also be italic_\n\n**This text will be bold**\n__This will also be bold__\n\n*You **can** combine them*\n`
              }
            </Text>
            <Text style={styles.exHeader}>
              Blockquotes
            </Text>
            <Text style={styles.exContent}>
              {
                `As Grace Hopper said:\n\n> I’ve always been more interested\n> in the future than in the past.\n`
              }
            </Text>
            <Text style={styles.exHeader}>
              Lists
            </Text>
            <Text style={styles.note}>
              unordered
            </Text>
            <Text style={styles.exContent}>
              {
                `* Item 1\n* Item 2\n    * Item 2a\n    * Item 2b\n`
              }
            </Text>
            <Text style={styles.note}>
              ordered
            </Text>
            <Text style={styles.exContent}>
              {
                `* Item 1\n* Item 2\n    * Item 2a\n    * Item 2b\n`
              }
            </Text>
            <Text style={styles.exHeader}>
              Images
            </Text>
            <Text style={styles.exContent}>
              {
                `![GitHub Logo](/images/logo.png)\n\nFormat: ![Alt Text](url)\n`
              }
            </Text>
            <Text style={styles.exHeader}>
              Links
            </Text>
            <Text style={styles.exContent}>
              {
                `http://github.com - automatic\n\n[GitHub](http://github.com)\n`
              }
            </Text>
            <Text style={styles.exHeader}>
              Fenced Code Blocks
            </Text>
            <Text style={styles.exContent}>
              {
                `\`\`\`javascript\nfunction test() {\n console.log("look ma’, no spaces");\n}\n\`\`\`\n`
              }
            </Text>
            <Text style={styles.exHeader}>
              Backslash Escapes
            </Text>
            <Text style={styles.note}>
              Markdown allows you to use backslash escapes to generate literal characters which would otherwise have special meaning in Markdown’s formatting syntax.
              </Text>
            <Text style={styles.exContent}>
              {
                `\*literal asterisks\*`
              }
            </Text>
            <Text style={styles.exHeader}>
              Task Lists
            </Text>
            <Text style={styles.exContent}>
              {
                `- [x] this is a complete item\n- [ ] this is an incomplete item\n- [x] @mentions, #refs, [links](), **formatting**, and <del>tags</del>supported\n- [x] list syntax required (any unordered or ordered list supported)\n`
              }
            </Text>
            <Text style={styles.exHeader}>
              Tables
            </Text>
            <Text style={styles.note}>
              You can create tables by assembling a list of words and dividing them with hyphens - (for the first row), and then separating each column with a pipe | :
            </Text>
            <Text style={styles.exContent}>
              {
                `First Header | Second Header\n------------ | -------------\nContent cell 1 | Content cell 2\nContent column 1 | Content column 2\n\n\n`
              }
            </Text>
            <Text>
              Source:
            </Text>
            <Text style={{textDecorationLine: 'underline'}}
                  onPress={() => Linking.openURL('https://guides.github.com/pdfs/markdown-cheatsheet-online.pdf')}>
              https://guides.github.com/pdfs/markdown-cheatsheet-online.pdf
            </Text>
          </Body>
        </CardItem>
        <CardItem>
          <Body>
            <TouchableOpacity onPress={this._toggleModal}>
              <Text style={styles.tipButton}>Hide me!</Text>
            </TouchableOpacity>
          </Body>
        </CardItem>
      </Card>
    </ScrollView>
    )
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
  }

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

    UserStore.logEvent('POST_SOLUTION')
    QuestStore.postSolution(solution, this)
  }

  upvote = (quest) => {
    UserStore.logEvent('UPVOTE_QUEST')
    FeedStore.upvoteQuest(quest)
  }

  downvote = (quest) => {
    UserStore.logEvent('DOWNVOTE_QUEST')
    FeedStore.downvoteQuest(quest)
  }

  delete = (quest) => {
    Alert.alert(
      'Remove Quest',
      'Are you sure?',
      [
        {text: 'CANCEL', onPress: () => {}},
        {text: 'YES', onPress: () => {
            UserStore.logEvent('DELETE_QUEST')
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
            UserStore.logEvent('FLAG_QUEST')
            QuestStore.flagAsDuplicate()
          }
        },
      ],
      { cancelable: true }
    )
  }

  setUser = (user_id) => {
    UserStore.logEvent('VIEW_USER')
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
  tipHeader: {
    textAlign: 'center',
    fontFamily: 'Gotham Bold',
    fontSize: 22,
    color: "#0b0c10"
  },
  tipContent: {
    fontFamily: "Proxima Nova Regular",
    fontSize: 18,
    color: "#0b0c10"
  },
  tipButton: {
    textAlign: 'center',
    fontFamily: "Gotham Bold",
    fontSize: 18,
    color: "#1f2833",
    width: responsiveWidth(80)
  },

  exHeader: {
    fontFamily: 'Gotham Bold',
  },
  exContent: {
    fontFamily: 'Courier Prime',
  },
  note: {
    fontFamily: 'Proxima Nova Light',
    fontSize: 16,
    color: "#0a0b09"
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
