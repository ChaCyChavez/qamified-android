import React from 'react';
import { StyleSheet,
         TextInput,
         ScrollView,
         View,
         TouchableHighlight,
         Modal } from 'react-native';
import { responsiveWidth,
         responsiveHeight,
         responsiveFontSize } from 'react-native-responsive-dimensions';
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
         Spinner } from 'native-base';
import { observer } from 'mobx-react';
import { UserStore,
         ProfileStore,
         QuestStore,
         FeedStore } from '../mobx';
import moment from 'moment';

@observer

export default class Profile extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
      editing: false,
      bio: UserStore.user.description,
    };
  }

  componentDidMount() {
    ProfileStore.initProfileFeed()
  }

  render() {
    const isAnswered = (isAnswered) => {
      return (isAnswered ? <Text note>Answered</Text> : <Text note>Unanswered</Text>);
    };

    var loading = <Spinner color='black' />
    var listItems = ProfileStore.profileFeed.map((item, index) => {
      return (
        <Card key={index}>
          <CardItem>
            <Text
              style={styles.title}>
                {item.title}
            </Text>
          </CardItem>
          <CardItem>
            { isAnswered(item.is_answered) }
          </CardItem>
          <CardItem>
            <Left>
              <Thumbnail 
                small
                source={{ uri:this.state.avatar_url }} />
                  <Body>
                    <View>
                      <Text style={styles.postFullName} ellipsizeMode="tail" numberOfLines={1}>{ item.full_name }</Text>
                      <Text style={styles.username} note>{ "@" + item.username } &#183; { moment(item.date_created).fromNow() }</Text>
                    </View>
                  </Body>
            </Left>
          </CardItem>
          <CardItem>
            <Text style={styles.description}>{item.description}</Text>
          </CardItem>
          <CardItem>
            <Left>
              <Button
                bordered
                style={{borderColor: 'white'}}
                onPress={() => this.upvote(item)}>
                <Icon 
                  name="ios-arrow-up" 
                  style={{fontSize: 28, color: this.isUpvoted(item.upvote) ? 'green' : 'grey'}}/>
              </Button>
              <Button
                bordered
                style={{borderColor: 'white'}}
                onPress={() => this.downvote(item)}>
                <Icon 
                  name="ios-arrow-down"
                  style={{fontSize: 28, color: this.isDownvoted(item.downvote) ? 'red' : 'grey'}}/>
              </Button>
              <Text>{item.votes}</Text>
            </Left>
            <Right>
              <Button
                transparent
                primary
                onPress={ () => this.viewQuest(item) }
                iconRight>
                  <Text 
                    uppercase={false}>
                      Read more
                  </Text>
                  <Icon name="ios-arrow-forward" />
              </Button>
            </Right>
          </CardItem>
        </Card>
      );
    }, this);

    return (
      <View style={styles.container}>
        <ScrollView behavior="padding" style={styles.scrollView}>
          <Card style={styles.infoContainer}>
            <CardItem>
              <Thumbnail 
                small
                source={{ uri:this.state.avatar_url }} />
            </CardItem>
            <CardItem>
              <Text
                style={styles.fullName}>
                  { UserStore.fullName }
              </Text>
            </CardItem>
            <CardItem>
              <Text
                style={styles.email}>
                  { UserStore.user.email }
              </Text>
            </CardItem>
            <CardItem>
              <Text
                style={styles.stats}>
                  { UserStore.user.points } &nbsp;
                  { UserStore.user.points > 1 ? "points" : "point" }
              </Text>
              <Text
                style={styles.stats}>
                  &#183; &nbsp;
                  Level &nbsp;
                  { UserStore.user.level }
              </Text>
              <Text
                style={styles.stats}>
                  &#183; &nbsp;
                  { UserStore.user.rank }
              </Text>
            </CardItem>
            <CardItem>
              { this.renderDescription() }
            </CardItem>
            <CardItem>
              { this.renderButton() }
            </CardItem>
          </Card>
          <Card>
          <CardItem>
            <Body style={{flexDirection: "row", justifyContent: "center"}}>
              <Button transparent onPress={()=>this.props.navigation.navigate('Achievements')}>
                <Icon name="ios-trophy"/>
                <Text uppercase={false}>Achievements</Text>
              </Button>
              <Button transparent onPress={()=>this.props.navigation.navigate('Todo')}>
                <Icon name="ios-list-box"/>
                <Text uppercase={false}>Todo</Text>
              </Button>
            </Body>
          </CardItem>
          </Card>
          <View>
            { ProfileStore.loading ? loading : listItems }
          </View>
        </ScrollView>
      </View>
    );
  };

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
  };

  renderButton = () => {
    if(this.state.editing) {
      return(
        <Button
          transparent
          primary
          onPress={ () => { this.updateBio() } }>
            <Text 
              uppercase={false}>
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
              uppercase={false}>
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
    QuestStore.setCurrentQuest(quest, this.props.navigation);
  }

  upvote = (quest) => {
    FeedStore.upvoteQuest(quest)
  }

  downvote = (quest) => {
    FeedStore.downvoteQuest(quest)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E7ECEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer : {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
    width: responsiveWidth(100),
    backgroundColor: "#dddddd",
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
    fontWeight: "bold",
  },
  postFullName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  username: {
    fontSize: 16,
  },
  stats: {
    fontSize: 16,
    color: "#222222",
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    textAlign: 'center',
  },
  bio: {
    textAlign: 'center',
    fontSize: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  questions: {
    elevation: 1,
    marginBottom: 12,
    padding: 20,
    backgroundColor: "white",
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
  }
});
