import React from 'react';
import { StyleSheet,
         View,
         ScrollView } from 'react-native';
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
         Icon,
         Input,
         Item,
         Spinner } from 'native-base';
import { observer } from 'mobx-react';
import { QuestStore,
         UserStore,
         FeedStore } from '../mobx';

@observer

export default class Feed extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
      items: [],
    };
  }

  componentDidMount() {
    FeedStore.initFeed()
  }

  render() {
    const {state} = this.props.navigation;
    var category = state.params ? state.params.category : "0";

    const isAnswered = (isAnswered) => {
      return (isAnswered ? <Text note>Answered</Text> : <Text note>Unanswered</Text>);
    };

    var loading = <Spinner color='black' />
    var listItems = FeedStore.quests.map((item, index) => {
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
                      <Text style={styles.full_name} ellipsizeMode="tail" numberOfLines={1}>{ item.full_name }</Text>
                      <Text style={styles.username} note>{ "@" + item.username } &#183; { item.date_created }</Text>
                    </View>
                  </Body>
            </Left>
          </CardItem>
          <CardItem>
            <Text style={styles.description}>{item.description}</Text>
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
        <View style={styles.container}>
          <ScrollView style={styles.scrollView}>
            <Card>
              <CardItem>
                <Left>
                  <Thumbnail
                    small
                    source={{ uri:'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg' }} />
                      <Body>
                        <Button
                          transparent
                          onPress={() => this.props.navigation.navigate('CreateQuest')}>
                            <Text
                              uppercase={false}>
                                Ask question...
                            </Text>
                        </Button>
                      </Body>
                </Left>
              </CardItem>
            </Card>
            { FeedStore.loading ? loading : listItems }
          </ScrollView>
        </View>

      </View>
    );
  }

  viewQuest = (quest) => {
    QuestStore.setCurrentQuest(quest, this.props.navigation);
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
