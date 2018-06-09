import React from 'react'
import { StyleSheet,
         TextInput,
         ScrollView,
         View,
         TouchableOpacity,
         RefreshControl,
         BackHandler } from 'react-native'
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
         Spinner } from 'native-base'
import { observer } from 'mobx-react'
import { UserStore,
         ProfileStore,
         QuestStore,
         FeedStore } from '../mobx'
import moment from 'moment'
import images from '../../assets/img/images'
import firebase from 'react-native-firebase'
import Markdown from 'react-native-markdown-renderer'
import Modal from 'react-native-modal'

@observer

export default class Profile extends React.Component {
  constructor(props) {

    super(props)
    this.state = {
      editing: false,
      bio: UserStore.user.description,
      isModalOpen: false
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton() {
    BackHandler.exitApp()
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    ProfileStore.initProfileFeed()
  }

  _onRefresh() {
    ProfileStore.initProfileFeed()
  }

  _toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }

  render() {
    const isAnswered = (isAnswered) => {
      return (isAnswered ? <Text note style={styles.status}>Answered</Text> : <Text note style={styles.status}>Unanswered</Text>)
    }

    var loading = <Spinner color='#66fcf1' />
    var listItems = ProfileStore.profileFeed.map((item, index) => {
      return (
        <Card style={styles.questions} key={index}>
          <CardItem style={{backgroundColor: "transparent"}}>
            <Text
              style={styles.title}>
                {item.title}
            </Text>
          </CardItem>
          <CardItem style={{backgroundColor: "transparent"}}>
            { isAnswered(item.is_answered) }
          </CardItem>
          <CardItem style={{backgroundColor: "transparent"}}>
            <Left>
              <Thumbnail 
                small
                source={images[item.user_avatar]} />
                  <Body>
                    <View>
                      <Text style={styles.postFullName} ellipsizeMode="tail" numberOfLines={1}>{ item.full_name }</Text>
                      <Text style={styles.username} note>{ "@" + item.username } &#183; { moment(item.date_created).fromNow() }</Text>
                    </View>
                  </Body>
            </Left>
          </CardItem>
          <CardItem style={{backgroundColor: "transparent"}}>
            <Markdown style={markdownStyles}>{item.description}</Markdown>
          </CardItem>
          <CardItem style={{backgroundColor: "transparent"}}>
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
        <ScrollView behavior="padding" style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={ProfileStore.loading}
              onRefresh={this._onRefresh.bind(this)}
            />}
        >
          <Card style={styles.infoContainer}>
            <TouchableOpacity style={{position: "absolute", right: 15, top: 10}} onPress={this._toggleModal}>
              <Icon name="ios-bulb" style={{color: 'white', fontSize: 18}}/>
            </TouchableOpacity>
            <Modal isVisible={this.state.isModalVisible}>
              { this.renderModal() }
            </Modal>
            <CardItem style={{backgroundColor: "transparent"}}>
              <Thumbnail
                source={images[UserStore.user.avatar]} />
            </CardItem>
            <CardItem style={{backgroundColor: "transparent"}}>
              <Text
                style={styles.fullName}>
                  { UserStore.fullName }
              </Text>
            </CardItem>
            <CardItem style={{backgroundColor: "transparent"}}>
              <Text
                style={styles.email}>
                  { UserStore.user.email  } &#183; { UserStore.user.institution  }
              </Text>
            </CardItem>
            <CardItem style={{backgroundColor: "transparent"}}>
              <Text
                style={styles.stats}>
                  { UserStore.user.points } &nbsp;
                  { UserStore.user.points > 1 ? "points" : "point" }
              </Text>
              <Text
                style={styles.stats}>
                  &nbsp; &#183;&nbsp;
                  Level &nbsp;
                  { UserStore.user.level }
              </Text>
              <Text
                style={styles.stats}>
                  &nbsp; &#183; &nbsp;
                  { UserStore.user.rank }
              </Text>
            </CardItem>
            <CardItem style={{backgroundColor: "transparent"}}>
              { this.renderDescription() }
            </CardItem>
            <CardItem style={{backgroundColor: "transparent"}}>
              { this.renderButton() }
            </CardItem>
          </Card>
          <Card style={styles.questions}>
          <CardItem style={{backgroundColor: "transparent"}}>
            <Body style={{flexDirection: "row", justifyContent: "center"}}>
              <Button transparent onPress={() => this.viewAchievements(this.props.navigation)}>
                <Icon style={styles.buttonText} name="ios-trophy"/>
                <Text style={styles.buttonText} uppercase={false}>Achievements</Text>
              </Button>
              <Button transparent onPress={() => this.viewTodos(this.props.navigation)}>
                <Icon style={styles.buttonText} name="ios-list-box"/>
                <Text style={styles.buttonText} uppercase={false}>Todo</Text>
              </Button>
            </Body>
          </CardItem>
          </Card>
          <View>
            { ProfileStore.loading ? loading : ( listItems.length > 0 ? listItems : <View>
                <Icon style={{textAlign: 'center', fontSize: 40, marginTop: 10, color: "#252627"}} name="ios-sad" />
                <Text style={styles.noQuests}>Oops, there's nothing to see here.</Text>
                </View>) }
          </View>
        </ScrollView>
      </View>
    )
  }

  renderModal = () => {
    return (
    <ScrollView>
      <Card style={{ flex: 1, backgroundColor: "white"}}>
        <CardItem>
          <Text style={styles.tipHeader}>Tip: Headquarter, Achievements and Todos</Text>
        </CardItem>
        <CardItem>
          <Text style={styles.tipContent}>
            {
              `Headquarter displays user information of the player, achievements and current todos. Quests that are posted and answered by the user is also displayed in this section.\n\nTo view achievements and todos, click the buttons below the user's information card.`
            }
          </Text>
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

  renderDescription = () => {
    if(this.state.editing) {
      return(
         <Input
            autoFocus={true}
            style={styles.bio}
            value={this.state.bio}
            multiline={true}
            placeholder="Add description"
            onChangeText={(input) => {this.setState({bio: input})}}/>
      )
    } else {
      return(
        <Text 
          style={styles.bio}>
          { UserStore.user.description }
        </Text>
      )
    }
  }

  renderButton = () => {
    if(this.state.editing) {
      return(
        <Button
          transparent
          primary
          onPress={ () => { this.updateBio() } }>
            <Text 
              uppercase={false}
              style={styles.buttonText}>
               Save
            </Text>
        </Button>
      )
    } else {
      return(
        <Button
          transparent
          primary
           onPress={() => {this.setState({editing: true})}}>
            <Text 
              uppercase={false}
              style={styles.buttonText}>
                Edit description
            </Text>
        </Button>
      )
    }
  }

  updateBio = () => {
    ProfileStore.updateBio(this)
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

  viewTodos = (navigation) => {
    UserStore.logEvent('VIEW_TODO')
    navigation.navigate('Todo')
  }

  viewAchievements = (navigation) => {
    UserStore.logEvent('VIEW_ACHIEVEMENT')
    navigation.navigate('Achievements')
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
    justifyContent: 'center',
    backgroundColor: "#1f2833",
    borderColor: 'transparent',
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
  questions: {
    backgroundColor: "#1f2833",
    borderColor: 'transparent',
  },
  status: {
    fontFamily: "Proxima Nova Light",
    fontSize: 16,
    color: "#c5c6c7",
  },
  votes: {
    fontFamily: "Proxima Nova Regular",
    color: "#e5e6e7",
  },
  buttonText: {
    fontFamily: "Proxima Nova Regular",
    color: "#66fcf1",
  },
  readMore: {
    color: "#66fcf1",
    fontFamily: "Proxima Nova Regular",
  },
  title: {
    fontFamily: "Gotham Bold",
    fontSize: 24,
    color: "#e5e6e7",
  },
  description: {
    fontSize: 18,
    fontFamily: "Proxima Nova Regular",
    color: "#e5e6e7",
  },
    noQuests: {
    textAlign: 'center',
    fontFamily: "Gotham Bold",
    color: "#252627",
    fontSize: 28,
    padding: 10,
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
