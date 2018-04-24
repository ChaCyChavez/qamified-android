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
import Solution from './Solution.js';

import firebase from 'react-native-firebase';
import { observer } from 'mobx-react';
import Store from '../mobx/Store.js';

@observer

export default class Quest extends React.Component {

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

    let itemsLength = Store.questState.current_quest.solutions ? Store.questState.current_quest.solutions.length : 0;

    const isAnswered = (isAnswered) => {
      return (isAnswered ? <Text note>Answered</Text> : <Text note>Unanswered</Text>);
    };

    var solutions = []
    if(Store.questState.current_quest.solutions) {
      var solutions = Store.questState.current_quest.solutions.map((item, index) => {
        return (
          <Solution item={item} key={index}/>
        );
      }, this);
    }

    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
        <KeyboardAvoidingView style={{flexGrow: 1}} >
          <Card>
            <CardItem>
                <Text
                  style={styles.title}>
                    {Store.questState.current_quest.title}
                </Text>
            </CardItem>
            <CardItem>
              <Left>
                <Thumbnail
                  small 
                  source={{ uri:this.state.avatar_url }} />
                    <Body>
                      <View style={styles.name}>
                        <Text style={styles.full_name}>{ Store.questState.current_quest.full_name }</Text>
                        <Text style={styles.username} note>{ "@" + Store.questState.current_quest.username }</Text>
                      </View>
                      { isAnswered(Store.questState.current_quest.is_answered) }
                    </Body>
              </Left>
            </CardItem>
            <CardItem>
              <Text>{ Store.questState.current_quest.description }</Text>
            </CardItem>
            <CardItem>
              <Left>
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
                <Text>{ Store.questState.current_quest.votes }</Text>
              </Left>
            </CardItem>
          </Card>
          <Card>
            <CardItem>
              <Text>{ itemsLength } Answer/s</Text>
            </CardItem>

            { solutions }

            <Card>
              <CardItem>
                <Left>
                  <Thumbnail
                    small
                    source={{ uri:this.state.avatar_url }} />
                      <Body>
                        <View style={styles.name}>
                          <Text style={styles.full_name}>{ Store.fullName }</Text>
                          <Text style={styles.username} note>{ "@" + Store.user.username }</Text>
                        </View>
                      </Body>
                </Left>
              </CardItem>
              <CardItem>
                <Item>
                  <Input 
                    style={styles.answerInput}
                    multiline={true}
                    placeholder="Post answer..."
                    onChangeText={(input) => this.setState({answer_input: input})}/>
                </Item>
              </CardItem>
              <CardItem>
                <Item regular>
                  <Right>
                    <Button
                      block
                      dark
                      onPress={ this.postSolution }>
                        <Text
                          uppercase={false}>
                            Submit
                        </Text>
                    </Button>
                  </Right>
                </Item>
              </CardItem>
            </Card>
          </Card>
        </KeyboardAvoidingView> 
        </ScrollView>
      </View>
    );
  }

  renderPostButton = () => {
    if(this.state.loading) {
      return (
        <Button
          block
          dark
          disabled>
            <Text
             uppercase={false}>
              Submitting...
            </Text>
        </Button>
      )
    }
    return (
      <Button
        block
        dark
        onPress={ this.postSolution }>
          <Text
            uppercase={false}>
              Submit
          </Text>
      </Button>
    )
  };

  postSolution = () => {
    this.setState({loading: true});
    var currDate = new Date()
    var solution = {
      date_created: currDate.getTime(),
      is_correct: false,
      description: this.state.answer_input,
      votes: 0,
      user_id: Store.user.id,
      username: Store.user.username,
      full_name: "{0} {1}. {2}".format(Store.user.first_name, Store.user.middle_name.charAt(0), Store.user.last_name),
    }

    firebase.database()
      .ref('posts/' + Store.questState.current_quest.id + "/solutions")
      .push().set(solution)
      .then(() => {
        this.setState({error: "", loading: false, answer_input: ""})
      })
      .catch((error) => {
        this.setState({error: error.message, loading: false})
      })
  };

  postReply = (id) => {
    this.setState({loading: true});
    var currDate = new Date()
    var reply = {
      date_created: currDate.getTime(),
      description: this.state.comment_input,
      user_id: Store.user.id,
      username: Store.user.username,
      full_name: "{0} {1}. {2}".format(Store.user.first_name, Store.user.middle_name.charAt(0), Store.user.last_name),
    }
    
    firebase.database()
      .ref('posts/' + Store.questState.current_quest.id + "/solutions/" + id + "/reply")
      .push().set(reply)
      .then(() => {
        this.setState({error: "", loading: false, answer_input: ""})
      })
      .catch((error) => {
        this.setState({error: error.message, loading: false})
      })
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
    fontSize: 18,
    marginLeft: 5,
  },
  readMore: {
    color: "blue",
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  description: {
    height: 50,
  },
});
