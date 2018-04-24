import React from 'react';
import { StyleSheet,
         TextInput,
         ScrollView,
         View } from 'react-native';
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
         Icon } from 'native-base';

export default class Profile extends React.Component {
  render() {
    var items = [{ id: 0, user: "Charles Cyrus S.J. Chavez", avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg', question: "How long should it take to learn Python completely and start developing programs?", is_answered: true, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
                  { id: 1, user: "Charles Cyrus S.J. Chavez", avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg', question: "Do Japanese people like foreigners who try to speak Japanese?", is_answered: false, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
                  { id: 2, user: "Charles Cyrus S.J. Chavez", avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg', question: "Where did Mark Zuckerberg code Facebook? Not it's physical location but the program used (by program, I don't mean coding languages).", is_answered: false, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
                  { id: 3, user: "Charles Cyrus S.J. Chavez", avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg', question: "Is GraphQL a REST killer?", is_answered: true, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
                  { id: 4, user: "Charles Cyrus S.J. Chavez", avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg', question: "Which Japanese words are used incorrectly abroad?", is_answered: true, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." }];
    
    const isAnswered = (isAnswered) => {
      return (isAnswered ? <Text note>Answered</Text> : <Text note>Unanswered</Text>);
    };

    var listItems = items.map(function(item, index) {
      return (
        <Card key={index}>
          <CardItem>
              <Text
                style={styles.title}>
                  {item.question}
              </Text>
          </CardItem>
          <CardItem>
            <Text>{item.description}</Text>
          </CardItem>
          <CardItem>
            <Left>
              <Button transparent>
                <Icon 
                  name="md-arrow-up"
                  size={32}/>
              </Button>
              <Button transparent>
                <Icon
                  name="md-arrow-down"
                  size={32}/>
              </Button>
              <Text>14324</Text>
            </Left>
            <Right>
              <Button
                transparent
                primary 
                onPress={() => this.props.navigation.navigate('Quest')}>
                  <Text
                    uppercase={false}>
                      Read more >
                  </Text>
              </Button>
            </Right>
          </CardItem>
        </Card>
      );
    }, this);

    return (
      <View style={styles.container}>
        <ScrollView behavior="padding" style={styles.scrollView}>
          <Card>
            <CardItem>
              <Icon
                name="person"
                size={64} 
                onPress={() => {}}/>
            </CardItem>
            <CardItem>
              <Text
                style={styles.fullName}>
                  Charles Cyrus S.J. Chavez
              </Text>
            </CardItem>
            <CardItem>
              <Text
                style={styles.email}>
                  chacychavez@gmail.com
              </Text>
            </CardItem>
            <CardItem>
              <Text 
                style={styles.bio}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Text>
            </CardItem>
          </Card>

          <View>
            {listItems}
          </View>
        </ScrollView>
      </View>
    );
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
    fontSize: 22,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bio: {
    textAlign: 'center',
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
});
