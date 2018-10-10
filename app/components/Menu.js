import React from 'react'
import { StyleSheet,
         TextInput,
         View,
         ScrollView,
         TouchableOpacity } from 'react-native'
import { List,
         ListItem,
         Thumbnail,
         Body,
         Left,
         Right,
         Text,
         Button,
         Icon,
         Card,
         CardItem } from 'native-base'
import { responsiveWidth,
         responsiveHeight,
         responsiveFontSize } from 'react-native-responsive-dimensions'

import { FeedStore,
         UserStore } from '../mobx'
import { observer } from 'mobx-react'
import images from '../../assets/img/images'
import Modal from 'react-native-modal'

@observer

export default class Menu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isModalVisible: false
    }
  }

  _toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }

  render () {
    const {goBack} = this.props.navigation
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <List>
            <ListItem itemHeader first>
              <Left>
                <Text style={styles.header}>Choose category</Text>
              </Left>
              <Right>
                <TouchableOpacity onPress={this._toggleModal}>
                  <Icon name="ios-bulb" style={{color: 'yellow'}}/>
                </TouchableOpacity>
                <Modal isVisible={this.state.isModalVisible}>
                  { this.renderModal() }
                </Modal>
              </Right>
            </ListItem>
            <ListItem avatar button onPress={() => {this.changeCategory("", goBack)}}>
              <Left>
                <Icon name="ios-bookmark" style={styles.categoryIcon}/>
              </Left>
              <Body>
                <Text style={styles.menuText}>All categories</Text>
              </Body>
            </ListItem>
            <ListItem avatar button onPress={() => {this.changeCategory("Algorithms", goBack)}}>
              <Left>
                <Icon name="ios-bookmark" style={styles.categoryIcon}/>
              </Left>
              <Body>
                <Text style={styles.menuText}>Algorithms</Text>
              </Body>
            </ListItem>
            <ListItem avatar button onPress={() => {this.changeCategory("Languages/Frameworks", goBack)}}>
              <Left>
                <Icon name="ios-bookmark" style={styles.categoryIcon}/>
              </Left>
              <Body>
                <Text style={styles.menuText}>Languages/Frameworks</Text>
              </Body>
            </ListItem>
            <ListItem avatar button onPress={() => {this.changeCategory("Software Development", goBack)}}>
              <Left>
                <Icon name="ios-bookmark" style={styles.categoryIcon}/>
              </Left>
              <Body>
                <Text style={styles.menuText}>Software Development</Text>
              </Body>
            </ListItem>
            <ListItem avatar button onPress={() => {this.changeCategory("Database", goBack)}}>
              <Left>
                <Icon name="ios-bookmark" style={styles.categoryIcon}/>
              </Left>
              <Body>
                <Text style={styles.menuText}>Database</Text>
              </Body>
            </ListItem>
            <ListItem itemHeader>
              <Text style={styles.header}>Action</Text>
            </ListItem>
            <ListItem avatar button onPress={() => UserStore.logOut(this.props.navigation)}>
              <Left>
                <Icon name="ios-log-out" style={styles.logoutIcon}/>
              </Left>
              <Body>
                <Text style={styles.menuText}>Logout</Text>
              </Body>
            </ListItem>
          </List>
        </ScrollView>
      </View>
    )
  }

  renderModal = () => {
    return (
    <ScrollView>
      <Card style={{ flex: 1, backgroundColor: "white"}}>
        <CardItem>
          <Text style={styles.tipHeader}>Tip: Leaderboard</Text>
        </CardItem>
        <CardItem>
          <Text style={styles.tipContent}>
            {
              `Questboard can be sorted based on categories.`
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

  changeCategory = (category, goBack) => {
    FeedStore.initFeed(category)
    goBack()
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
    backgroundColor: "#0b0c10",
  },
  header: {
    fontFamily: "Gotham Bold",
    color: "#e5e6e7",
    fontSize: 22,
  },
  categoryIcon: {
    fontSize: 30,
    color: "#e5e6e7"
  },
  menuText: {
    fontFamily: "Proxima Nova Regular",
    color: "#e5e6e7",
    fontSize: 20,
  },
  logoutIcon: {
    color: "#ef0202",
    fontSize: 30,
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
