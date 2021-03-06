import React from 'react'
import { StyleSheet,
         TextInput,
         ScrollView,
         View,
         TouchableHighlight } from 'react-native'
import { responsiveWidth,
         responsiveHeight,
         responsiveFontSize } from 'react-native-responsive-dimensions'
import { Text,
         Left,
         Right,
         Thumbnail,
         Body,
         Card,
         CardItem,
         Button,
         Icon,
         Item,
         Input,
         Spinner,
         ActionSheet } from 'native-base'
import { observer } from 'mobx-react'
import { UserProfileStore,
         QuestStore,
         FeedStore,
         UserStore } from '../mobx'
import moment from 'moment'
import firebase from 'react-native-firebase'
import images from '../../assets/img/images'
import Markdown from 'react-native-markdown-renderer'


@observer
export default class UserProfile extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      editing: false,
      buttons: [{ text: "False Information", icon: "ios-bookmark", iconColor: "#2c8ef4" },
                { text: "Trolling", icon: "ios-bookmark", iconColor: "#2c8ef4" },
                { text: "Spamming", icon: "ios-bookmark", iconColor: "#2c8ef4" }],
      destructiveIndex: 3,
      cancelIndex: 4,
    }
  }

  componentDidMount() {
    UserProfileStore.initProfileFeed()
    UserProfileStore.open = true
  }

  componentWillUnmount() {
    UserProfileStore.open = false
  }

  render() {
    const isAnswered = (isAnswered) => {
      return (isAnswered ? <Text note style={styles.status}>Answered</Text> : <Text note style={styles.status}>Unanswered</Text>)
    }

    var loading = <Spinner color='#c5c6c7' />
    var listItems = UserProfileStore.profileFeed.map((item, index) => {
      return (
        <Card style={styles.questions} key={index}>
          <CardItem style={{backgroundColor: 'transparent'}}>
            <Text
              style={styles.title}>
                {item.title}
            </Text>
          </CardItem>
          <CardItem style={{backgroundColor: 'transparent'}}>
            { isAnswered(item.is_answered) }
          </CardItem>
          <CardItem style={{backgroundColor: 'transparent'}}>
            <Left>
              <Thumbnail
                small
                source={ images[item.user_avatar]} />
                  <Body>
                    <View>
                      <Text style={styles.postFullName} ellipsizeMode="tail" numberOfLines={1}>{ item.full_name }</Text>
                      <Text style={styles.username} note>{ "@" + item.username } &#183; { moment(item.date_created).fromNow() }</Text>
                    </View>
                  </Body>
            </Left>
          </CardItem>
          <CardItem style={{backgroundColor: 'transparent'}}>
            <Markdown style={markdownStyles}>{item.description}</Markdown>
          </CardItem>
          <CardItem style={{backgroundColor: 'transparent'}}>
            <Left>
              <Button
                bordered
                style={{borderColor: 'transparent'}}
                onPress={() => this.upvote(item)}>
                <Icon 
                  name="ios-arrow-up" 
                  style={{fontSize: 28, color: this.isUpvoted(item.upvote) ? 'green' : 'grey'}}/>
              </Button>
              <Button
                bordered
                style={{borderColor: 'transparent'}}
                onPress={() => this.downvote(item)}>
                <Icon 
                  name="ios-arrow-down"
                  style={{fontSize: 28, color: this.isDownvoted(item.downvote) ? 'red' : 'grey'}}/>
              </Button>
              <Text style={styles.votes}>{item.votes}</Text>
            </Left>
            <Right>
              <Button
                transparent
                primary
                onPress={ () => this.viewQuest(item) }
                iconRight>
                  <Text 
                    uppercase={false}
                    style={styles.readMore}>
                      Read more
                  </Text>
                  <Icon style={{color: "#66fcf1"}}name="ios-arrow-forward" />
              </Button>
            </Right>
          </CardItem>
        </Card>
      )
    }, this)

    return (
      <View style={styles.container}>
        <ScrollView behavior="padding" style={styles.scrollView}>
          <Card style={styles.infoContainer}>
            <CardItem style={{backgroundColor: 'transparent'}}>
              <Body style={{flexDirection: "row", flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Thumbnail
                  source={images[UserProfileStore.current_user.avatar]} style={{marginLeft: 3, marginRight: 3}}/>
                <Thumbnail square small
                  source={images[UserProfileStore.current_user.rank.toLowerCase()]} style={{marginLeft: 3, marginRight: 3}}/>
              </Body>
            </CardItem>
            <CardItem style={{backgroundColor: 'transparent'}}>
              <Text
                style={styles.fullName}>
                  { UserProfileStore.fullName }
              </Text>
            </CardItem>
            <CardItem style={{backgroundColor: 'transparent'}}>
              <Text
                style={styles.email}>
                  { UserProfileStore.current_user.email } &#183; { UserProfileStore.current_user.institution }
              </Text>
            </CardItem>
            <CardItem style={{backgroundColor: 'transparent'}}>
              <Text
                style={styles.stats}>
                  { UserProfileStore.current_user.points + (UserProfileStore.current_user.points > 1 ? " points" : " point") }
              </Text>
              <Text
                style={styles.stats}>
                  &nbsp; &#183; &nbsp;
                  { UserProfileStore.current_user.rank}
              </Text>
            </CardItem>
            <CardItem style={{backgroundColor: 'transparent'}}>
              <Text
                style={styles.stats}>
                  { UserProfileStore.current_user.experience + (UserProfileStore.current_user.experience > 1 ? " experiences" : " experience") }
              </Text>
              <Text
                style={styles.stats}>
                  &nbsp; &#183;&nbsp;
                  Level &nbsp;
                  { UserProfileStore.current_user.level }
              </Text>
            </CardItem>
            <CardItem style={{backgroundColor: 'transparent'}}>
              { this.renderDescription() }
            </CardItem>
            {
              (UserProfileStore.current_user._id != UserStore.user._id) ?
                (
                  <CardItem style={{backgroundColor: 'transparent'}}>
                    <Button transparent onPress={() => this.report()}>
                      <Text style={styles.buttonText} uppercase={false}>Report this player</Text>
                    </Button>
                  </CardItem>
                ) : null
            }
            
          </Card>
          <View>
            { UserProfileStore.loading ? loading : listItems }
          </View>
        </ScrollView>
      </View>
    )
  }

  isUpvoted = (upvote) => {
    if(!upvote) {
      return false
    } else if(upvote.includes(UserProfileStore.current_user._id)) {
      return true
    } else {
      return false
    }
  }

  isDownvoted = (downvote) => {
    if(!downvote) {
      return false
    } else if(downvote.includes(UserProfileStore.current_user._id)) {
      return true
    } else {
      return false
    }
  }

  renderDescription = () => {
    return(
      <Text 
        style={styles.bio}>
        { UserProfileStore.current_user.description }
      </Text>
    )
  }

  viewQuest = (quest) => {
    UserStore.logEvent('VIEW_QUEST')
    QuestStore.setCurrentQuest(quest, this.props.navigation)
  }

  upvote = (quest) => {
    UserStore.logEvent('UPVOTE_QUEST')
    FeedStore.upvoteQuest(quest)
  }

  downvote = (quest) => {
    UserStore.logEvent('DOWNVOTE_QUEST')
    FeedStore.downvoteQuest(quest)
  }

  report = () => {
    ActionSheet.show(
      {
        options: this.state.buttons,
        cancelButtonIndex: this.state.cancelIndex,
        destructiveButtonIndex: this.state.destructiveIndex,
        title: "Report because"
      },
      buttonIndex => { this.checkClicked(this.state.buttons[buttonIndex]) }
    )
  }

  checkClicked = (clicked) => {
    UserStore.logEvent('REPORT_USER')
    UserProfileStore.reportUser(clicked.text)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer : {
    flex: 1,
    alignItems: 'center',
    backgroundColor: "#1f2833",
    justifyContent: 'center',
    borderColor: "transparent",
  },
  scrollView: {
    flex: 1,
    width: responsiveWidth(100),
    backgroundColor: "#0b0c10",
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    elevation: 1,
    marginBottom: 12,
    padding: 20,
    backgroundColor: "white",
  },
  fullName: {
    textAlign: 'center',
    fontSize: 28,
    fontFamily: "Gotham Bold",
    color: "#e5e6e7",
  },
  postFullName: {
    fontSize: 18,
    fontFamily: "Gotham Bold",
    color: "#e5e6e7",
  },
  username: {
    fontSize: 16,
    fontFamily: "Proxima Nova Light",
    color: "#c5c6c7",
  },
  stats: {
    fontSize: 16,
    color: "#222222",
    textAlign: 'center',
    fontFamily: "Proxima Nova Regular",
    color: "#e5e6e7",
  },
  email: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: "Proxima Nova Regular",
    color: "#e5e6e7",
  },
  bio: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: "Proxima Nova Regular",
    color: "#e5e6e7",
  },
  buttonText: {
    fontFamily: "Proxima Nova Regular",
    color: "#66fcf1",
  },
  title: {
    fontFamily: "Gotham Bold",
    fontSize: 24,
    color: "#e5e6e7",
  },
  status: {
    fontFamily: "Proxima Nova Light",
    fontSize: 16,
    color: "#c5c6c7",
  },
  questions: {
    backgroundColor: "#1f2833",
    borderColor: 'transparent',
  },
  readMore: {
    color: "#66fcf1",
    fontFamily: "Proxima Nova Regular",
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
  readMore: {
    color: "#66fcf1",
    fontFamily: "Proxima Nova Regular",
  },
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
