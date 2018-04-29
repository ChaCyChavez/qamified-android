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
         Icon,
         Spinner } from 'native-base';
import Solution from './Solution.js';
import { observer } from 'mobx-react';
import { QuestStore,
         UserStore } from '../mobx';

@observer

export default class Quest extends React.Component {

  constructor(props) {
    super(props);

    this.postSolution = this.postSolution.bind(this)
    this.state = {
      avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    }
  };

  render() {

    let itemsLength = QuestStore.current_solutions ? QuestStore.current_solutions.length : 0;

    const isAnswered = (isAnswered) => {
      return (isAnswered ? <Text note>Answered</Text> : <Text note>Unanswered</Text>);
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
          <Card>
            <CardItem>
              <Text
                style={styles.title}>
                  {QuestStore.current_quest.title}
              </Text>
            </CardItem>
            <CardItem>
              { isAnswered(QuestStore.current_quest.is_answered) }
            </CardItem>
            <CardItem>
              <Left>
                <Thumbnail
                  small 
                  source={{ uri:this.state.avatar_url }} />
                    <Body>
                      <View>
                        <Text style={styles.full_name} ellipsizeMode="tail" numberOfLines={1}>{ QuestStore.current_quest.full_name }</Text>
                        <Text style={styles.username} note ellipsizeMode="tail" numberOfLines={1}>{ "@" + QuestStore.current_quest.username } &#183; { QuestStore.current_quest.date_created }</Text>
                      </View>
                    </Body>
              </Left>
            </CardItem>
            <CardItem>
              <Text style={styles.description}>{ QuestStore.current_quest.description }</Text>
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
                <Text>{ QuestStore.current_quest.votes }</Text>
              </Left>
            </CardItem>
          </Card>
          <Card>
            <CardItem style={styles.spinCon}>
              { QuestStore.initializing ? <Spinner color='black' /> : <Text>{ itemsLength } Answer/s</Text> }
            </CardItem>
          </Card>
          { QuestStore.initializing ? <View></View> : solutions }
          <Card>
            <CardItem>
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
            <CardItem>
              <Item>
                <Input
                  value={QuestStore.solution}
                  style={styles.answerInput}
                  multiline={true}
                  placeholder="Post answer..."
                  onChangeText={(input) => {QuestStore.solution = input}}/>
              </Item>
            </CardItem>
            <CardItem>
              <Item regular>
                <Right>
                  { this.renderPostButton() }
                </Right>
              </Item>
            </CardItem>
          </Card>
        </KeyboardAvoidingView> 
        </ScrollView>
      </View>
    );
  }

  renderPostButton = () => {
    if(QuestStore.loading) {
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
    var currDate = new Date()
    var solution = {
      quest_id: QuestStore.current_quest._id,
      date_created: currDate.getTime(),
      is_correct: false,
      description: QuestStore.solution,
      votes: 0,
      user_id: UserStore.user.id,
      username: UserStore.user.username,
      full_name: UserStore.fullName,
    }
    QuestStore.postSolution(solution);
    
  };

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
  full_name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  username: {
    fontSize: 16,
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