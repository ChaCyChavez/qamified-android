import React from 'react';
import { StyleSheet,
         TextInput,
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
         Item } from 'native-base';
import { observer } from 'mobx-react';
import { UserStore } from '../mobx';
import moment from 'moment';

@observer

export default class CreateQuest extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
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
                          <Text style={styles.full_name}>{ UserStore.fullName }</Text>
                          <Text style={styles.username} note>{ "@" + UserStore.user.username }</Text>
                        </Body>
                  </Left>
                </CardItem>
                <CardItem>
                  <Item>
                    <Input
                      style={styles.title}
                      placeholder="Title"
                      onChangeText={(input) => {UserStore.title = input}}/>
                  </Item>
                </CardItem>
                <CardItem>
                  <Item>
                    <Input
                      style={styles.description}
                      multiline={true}
                      placeholder="Ask question.."
                      onChangeText={(input) => {UserStore.description = input}}/>
                  </Item>
                </CardItem>
                <CardItem>
                  { this.renderErrorMessage() }
                </CardItem>
                <CardItem>
                  <Item regular>
                    <Right>
                      { this.renderPostButton() }
                    </Right>
                  </Item>
                </CardItem>
              </Card>
          </ScrollView>
        </View>
      </View>
    );
  }

  renderPostButton = () => {
    if(UserStore.loading) {
      return (
        <Button
          block
          dark
          disabled>
            <Text
             uppercase={false}>
              Posting...
            </Text>
        </Button>
      )
    }
    return (
      <Button
        block
        dark
        onPress={this.postQuest}>
          <Text
            uppercase={false}>
              Post
          </Text>
      </Button>
    )
  };

  postQuest = () => {
    var currDate = new Date();
    var quest = {
      date_created: moment().format(),
      title: UserStore.title,
      description: UserStore.description,
      votes: 0,
      user_id: UserStore.user._id,
      is_answered: false,
      username: UserStore.user.username,
      full_name: UserStore.fullName,
      solutions: [],
    }

    UserStore.postQuest(this.props.navigation, quest)
  };

  renderErrorMessage = () => {
    if(UserStore.error) {
      return (
        <Text>{UserStore.error}</Text>
      )
    }
  };
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
  headerIcon: {
    width: responsiveWidth(10),
  },
  scrollView: { 
    flex: 1,
    width: responsiveWidth(100),
    backgroundColor: "#dddddd",
  },
  full_name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  username: {
    fontSize: 16,
  },
});
