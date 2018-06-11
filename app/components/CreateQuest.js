import React from 'react'
import { StyleSheet,
         View,
         ScrollView,
         TouchableOpacity,
         Linking } from 'react-native'
import { responsiveHeight,
         responsiveWidth,
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
         Input,
         Item,
         Picker } from 'native-base'
import { observer } from 'mobx-react'
import { UserStore } from '../mobx'
import moment from 'moment'
import images from '../../assets/img/images'
import firebase from 'react-native-firebase'
import Modal from 'react-native-modal'

@observer

export default class CreateQuest extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: "",
      description: "",
      selected: "Algorithms",
      isModalVisible: false
    }
  }

  onValueChange(value) {
    this.setState({
      selected: value
    })
  }

  _toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
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
                      source={images[UserStore.user.avatar]} />
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
                    <TouchableOpacity style={{position: "absolute", right: 1, top: 1}} onPress={this._toggleModal}>
                      <Icon name="ios-bulb" style={{color: 'yellow', fontSize: 20}}/>
                    </TouchableOpacity>
                    <Modal isVisible={this.state.isModalVisible}>
                      { this.renderModal() }
                    </Modal>
                  </Item>
                </CardItem>
                <CardItem style={{backgroundColor: 'transparent'}}>
                  <Picker
                    mode="dropdown"
                    selectedValue={this.state.selected}
                    onValueChange={this.onValueChange.bind(this)}
                    style={{color: "white"}}
                  >
                    <Picker.Item color="#0b0c10" label="Algorithms" value="Algorithms" />
                    <Picker.Item color="#0b0c10" label="Languages/Frameworks" value="Languages/Frameworks" />
                    <Picker.Item color="#0b0c10" label="Software Development" value="Software Development" />
                    <Picker.Item color="#0b0c10" label="Database" value="Database" />
                  </Picker>
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
    )
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
  }

  renderModal = () => {
    return (
    <ScrollView>
      <Card style={{ flex: 1, backgroundColor: "white"}}>
        <CardItem>
          <Text style={styles.tipHeader}>Tip: Creating Quest</Text>
        </CardItem>
        <CardItem>
          <Body style={{width: responsiveWidth(40)}}>
            <Text style={styles.tipContent}>
              {
                `This application supports markdown (lightweight marup language).\n\nExample:\n`
              }
            </Text>
            <Text style={styles.exHeader}>
              Headers
            </Text>
            <Text style={styles.exContent}>
              {
                `# This is an <h1> tag\n## This is an <h2> tag\n###### This is an <h6> tag\n`
              }
            </Text>
            <Text style={styles.exHeader}>
              Emphasis
            </Text>
            <Text style={styles.exContent}>
              {
                `*This text will be italic*\n_This will also be italic_\n\n**This text will be bold**\n__This will also be bold__\n\n*You **can** combine them*\n`
              }
            </Text>
            <Text style={styles.exHeader}>
              Blockquotes
            </Text>
            <Text style={styles.exContent}>
              {
                `As Grace Hopper said:\n\n> I’ve always been more interested\n> in the future than in the past.\n`
              }
            </Text>
            <Text style={styles.exHeader}>
              Lists
            </Text>
            <Text style={styles.note}>
              unordered
            </Text>
            <Text style={styles.exContent}>
              {
                `* Item 1\n* Item 2\n    * Item 2a\n    * Item 2b\n`
              }
            </Text>
            <Text style={styles.note}>
              ordered
            </Text>
            <Text style={styles.exContent}>
              {
                `* Item 1\n* Item 2\n    * Item 2a\n    * Item 2b\n`
              }
            </Text>
            <Text style={styles.exHeader}>
              Images
            </Text>
            <Text style={styles.exContent}>
              {
                `![GitHub Logo](/images/logo.png)\n\nFormat: ![Alt Text](url)\n`
              }
            </Text>
            <Text style={styles.exHeader}>
              Links
            </Text>
            <Text style={styles.exContent}>
              {
                `http://github.com - automatic\n\n[GitHub](http://github.com)\n`
              }
            </Text>
            <Text style={styles.exHeader}>
              Fenced Code Blocks
            </Text>
            <Text style={styles.exContent}>
              {
                `\`\`\`javascript\nfunction test() {\n console.log("look ma’, no spaces");\n}\n\`\`\`\n`
              }
            </Text>
            <Text style={styles.exHeader}>
              Backslash Escapes
            </Text>
            <Text style={styles.note}>
              Markdown allows you to use backslash escapes to generate literal characters which would otherwise have special meaning in Markdown’s formatting syntax.
              </Text>
            <Text style={styles.exContent}>
              {
                `\*literal asterisks\*`
              }
            </Text>
            <Text style={styles.exHeader}>
              Task Lists
            </Text>
            <Text style={styles.exContent}>
              {
                `- [x] this is a complete item\n- [ ] this is an incomplete item\n- [x] @mentions, #refs, [links](), **formatting**, and <del>tags</del>supported\n- [x] list syntax required (any unordered or ordered list supported)\n`
              }
            </Text>
            <Text style={styles.exHeader}>
              Tables
            </Text>
            <Text style={styles.note}>
              You can create tables by assembling a list of words and dividing them with hyphens - (for the first row), and then separating each column with a pipe | :
            </Text>
            <Text style={styles.exContent}>
              {
                `First Header | Second Header\n------------ | -------------\nContent cell 1 | Content cell 2\nContent column 1 | Content column 2\n\n\n`
              }
            </Text>
            <Text>
              Source:
            </Text>
            <Text style={{textDecorationLine: 'underline'}}
                  onPress={() => Linking.openURL('https://guides.github.com/pdfs/markdown-cheatsheet-online.pdf')}>
              https://guides.github.com/pdfs/markdown-cheatsheet-online.pdf
            </Text>
          </Body>
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

  postQuest = () => {
    var currDate = new Date()
    var quest = {
      date_created: moment().format(),
      title: this.state.title,
      description: this.state.description,
      category: this.state.selected,
      votes: 0,
      user_id: UserStore.user._id,
      is_answered: false,
      username: UserStore.user.username,
      full_name: UserStore.fullName,
      solutions: [],
      user_avatar: UserStore.user.avatar,
      is_duplicate: false,
    }

    
    UserStore.logEvent('POST_QUEST')

    UserStore.postQuest(this.props.navigation, quest)
  }

  renderErrorMessage = () => {
    if(UserStore.error) {
      return (
        <Text>{UserStore.error}</Text>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },

  exHeader: {
    fontFamily: 'Gotham Bold',
  },

  exContent: {
    fontFamily: 'Courier Prime',
  },
  note: {
    fontFamily: 'Proxima Nova Light',
    fontSize: 16,
    color: "#0a0b09"
  }
})
