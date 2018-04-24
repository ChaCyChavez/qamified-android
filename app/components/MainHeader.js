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
import SideMenu from './SideMenu.js';

var BUTTONS = [{ text: "Option 0", icon: "american-football", iconColor: "#2c8ef4" },
  { text: "Option 1", icon: "analytics", iconColor: "#f42ced" },
  { text: "Option 2", icon: "aperture", iconColor: "#ea943b" },
  { text: "Logout", icon: "trash", iconColor: "#fa213b" },
  { text: "Cancel", icon: "close", iconColor: "#25de5b" }];
var DESTRUCTIVE_INDEX = 3;
var CANCEL_INDEX = 4;

export default class MainHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  render() { 
    return (
        <Header 
          searchBar
          rounded style={styles.header}
          hasTabs={!!this.props.hasTabs}>
            <Item>
              <Button transparent onPress={() => 
                ActionSheet.show(
                  {
                    options: BUTTONS,
                    cancelButtonIndex: CANCEL_INDEX,
                    destructiveButtonIndex: DESTRUCTIVE_INDEX,
                    title: "Categories"
                  },
                  buttonIndex => { this.checkClicked(BUTTONS[buttonIndex]) }
                )}>
                  <Icon name="ios-menu" size={32} style={styles.headerIcon}/>
              </Button>
              <Input placeholder="Search" />
              <Button transparent>
                <Icon
                  name="ios-create"
                  style={styles.headerIcon}
                  size={32}/>
              </Button>
            </Item>
        </Header>
    );
  }
  checkClicked = (buttonClicked) => {
    if(buttonClicked.text === "Logout") {
      this.props.navigation.navigate('Login')
    }
  }
}

const styles = StyleSheet.create({ 
  container: {
    height: 35,
  },
  header: {
    width: responsiveWidth(100),
    backgroundColor: "#222222",
  },
  searchBar: {
    width: responsiveWidth(60),
    height: 35,
    fontSize: 16,
    backgroundColor: 'white',
    padding: 8,
    color: '#111111',
    marginLeft: 0
  },
  headerIcon: {
    margin: 0,
    color: '#222222'
  },
});

