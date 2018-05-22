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
         Item } from 'native-base';
import { observer } from 'mobx-react';
import { UserStore } from '../mobx';
import moment from 'moment';

@observer

export default class CreateQuest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: ""
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <ScrollView style={styles.scrollView}>
              <Card style={styles.card}>
                <CardItem style={{backgroundColor: 'transparent'}}>
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
                <CardItem style={{backgroundColor: 'transparent'}}>
                  <Item>
                    <Input
                      style={styles.title}
                      placeholder="Title"
                      placeholderTextColor="#959697"
                      onChangeText={(input) => {this.state.title = input}}/>
                  </Item>
                </CardItem>
                <CardItem style={{backgroundColor: 'transparent'}}>
                  <Item>
                    <Input
                      style={styles.description}
                      multiline={true}
                      placeholder="Ask question.."
                      placeholderTextColor="#959697"
                      onChangeText={(input) => {this.setState({description: input})}}/>
                  </Item>
                </CardItem>
                <CardItem style={{backgroundColor: 'transparent'}}>
                  { this.renderErrorMessage() }
                </CardItem>
                <CardItem style={{backgroundColor: 'transparent'}}>
                  { this.renderPostButton() }
                </CardItem>
              </Card>
          </ScrollView>
        </View>
      </View>
    );
  }

  completeField = () => {
    return (this.state.title &&
            this.state.description) ? true : false
  }
  renderPostButton = () => {
    if(UserStore.loading) {
      return (
        <Button
          transparent
          style={styles.disabledPostButton}
          disabled>
            <Text
             uppercase={false}
             style={{color: "white", fontFamily: "Proxima Nova Regular"}}>
              Posting...
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
             style={{color: "white", fontFamily: "Proxima Nova Regular"}}>
              Post
            </Text>
        </Button>
      )
    }
    return (
      <Button
        transparent
        style={styles.postButton}
        onPress={this.postQuest}>
          <Text
            uppercase={false}
            style={{color: "white", fontFamily: "Proxima Nova Regular"}}>
              Post
          </Text>
      </Button>
    )
  };

  postQuest = () => {
    var currDate = new Date();
    var quest = {
      date_created: moment().format(),
      title: this.state.title,
      description: this.state.description,
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
  scrollView: { 
    flex: 1,
    width: responsiveWidth(100),
    backgroundColor: "#0b0c10",
  },
  card: {
    backgroundColor: '#1f2833',
    borderColor: 'transparent',
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
    color: "#e5e6e7",
    fontFamily: "Proxima Nova Regular",
  },
  description: {
    color: "#e5e6e7",
    fontFamily: "Proxima Nova Regular",
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
});
