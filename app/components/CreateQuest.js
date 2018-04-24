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
import firebase from 'react-native-firebase';
import { observer } from 'mobx-react';
import Store from '../mobx/Store.js';

@observer

export default class CreateQuest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      description: "",
    }
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
                        <Text>{Store.fullName}</Text>
                    </Body>
                  </Left>
                </CardItem>
                <CardItem>
                  <Item>
                    <Input
                      style={styles.title}
                      placeholder="Title"
                      onChangeText={(input) => this.setState({title: input})}/>
                  </Item>
                </CardItem>
                <CardItem>
                  <Item>
                    <Input
                      style={styles.description}
                      multiline={true}
                      placeholder="Ask question.."
                      onChangeText={(input) => this.setState({description: input})}/>
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
    if(this.state.loading) {
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
    Store.postQuest(this.props.navigation, this.state)
  };

  renderErrorMessage = () => {
    if(this.state.error) {
      return (
        <Text>{this.state.error}</Text>
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
  title: {

  },
  description: {
    height: 50,
  },
});
