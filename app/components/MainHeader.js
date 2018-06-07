import React from 'react';
import { StyleSheet,
         Text,
         TextInput,
         View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { responsiveWidth,
         responsiveHeight,
         responsiveFontSize } from 'react-native-responsive-dimensions';
import { ActionSheet,
         Container,
         Header,
         Item,
         Input,
         Button,
         Icon } from 'native-base';
import { UserStore,
         SearchStore,
         FeedStore } from '../mobx';

var BUTTONS = [{ text: "All", icon: "ios-bookmark", iconColor: "#2c8ef4" },
  { text: "Algorithms", icon: "ios-bookmark", iconColor: "#2c8ef4" },
  { text: "Languages/Frameworks", icon: "ios-bookmark", iconColor: "#2c8ef4" },
  { text: "Software Development", icon: "ios-bookmark", iconColor: "#2c8ef4" },
  { text: "Database", icon: "ios-bookmark", iconColor: "#2c8ef4" },
  { text: "Logout", icon: "ios-log-out", iconColor: "#fa213b" },
  { text: "Cancel", icon: "ios-close", iconColor: "#fa213b" }];
var DESTRUCTIVE_INDEX = 3;
var CANCEL_INDEX = 4;

export default class MainHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
    };
  }
  
  render() { 
    return (
        <Header 
          searchBar
          rounded style={styles.header}
          hasTabs={!!this.props.hasTabs}>
            <Item>
              <Button transparent 
                style={styles.menuButton} onPress={() => this.props.navigation.navigate('Menu')}>
                  <Icon name="ios-menu" style={styles.headerIcon}/>
              </Button>
              <Input style={styles.searchInput} placeholder="Search keyword"
                onChangeText={(input) => {this.setState({query: input})}} />   
              { this.renderSearchButton() }
            </Item>
        </Header>
    );
  }
  checkClicked = (buttonClicked) => {
    if(buttonClicked.text === "Logout") {
      UserStore.logOut(this.props.navigation)
    }
    else if(buttonClicked.text === "All") {
      FeedStore.initFeed("")
    }
    else {
      FeedStore.initFeed(buttonClicked.text)
    }
  }

  renderSearchButton = () => {
    if(this.state.query) {
      return(
        <Button transparent 
          style={styles.menuButton} onPress={() => {this.search()}}>
            <Icon name="ios-search" style={styles.headerIcon}/>
        </Button>
      )
    }
  }

  search = () => {
    SearchStore.search(this.state.query, this.props.navigation);
  }
}

const styles = StyleSheet.create({
  header: {
    width: responsiveWidth(100),
    backgroundColor: "#222222",
  },
  searchBar: {
    width: responsiveWidth(60),
    height: 36,
    padding: 8,
    marginLeft: 0
  },
  searchInput: {
    fontFamily: "Proxima Nova Regular",
    fontSize: 18,
    backgroundColor: '#e5e6e7',
    color: "#1f2833",
  },
  headerIcon: {
    margin: 0,
    color: '#1f2833',
    fontSize: 30,
  },
  menuButton: {
    backgroundColor: '#e5e6e7',
  }
});

