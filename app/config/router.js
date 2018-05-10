import React from 'react';
import { StyleSheet, StatusBar, Platform, TextInput, Text, View, TouchableOpacity, Button, Keyboard } from 'react-native';
import { DrawerNavigator, TabNavigator, StackNavigator, TabBarBottom, NavigationActions } from 'react-navigation';
import { Icon } from 'native-base';

import Login from '../components/Login.js';
import Register from '../components/Register.js';
import Feed from '../components/Feed.js';
import Quest from '../components/Quest.js';
import CreateQuest from '../components/CreateQuest.js';
import Profile from '../components/Profile.js';
import Notification from '../components/Notification.js';
import SideMenu from '../components/SideMenu.js';
import MainHeader from '../components/MainHeader.js';
import Todo from '../components/Todo.js';
import Achievements from '../components/Achievements.js';
import Ranking from '../components/Ranking.js';
import UserProfile from '../components/UserProfile.js';

export const Stack = StackNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
		  title: 'Login',
      header: null,
    },
	},
  Register: {
    screen: Register,
    navigationOptions: {
      title: 'Register',
      header: null,
    },
  },
});

export const Drawer = DrawerNavigator({
  Category_1: {
     screen: props => <Feed {...props}/>,
  },
  Category_2: {
     screen: props => <Feed {...props}/>,
  },
  Category_3: {
     screen: props => <Feed {...props}/>,
  }
}, {
  contentComponent: SideMenu,
});


export const Tab = TabNavigator({
  Feed: {
    screen: Feed,
    navigationOptions: {
      tabBarLabel: 'Feed',
      tabBarIcon: ({ tintColor }) => <Icon name="ios-home" size={25} style={styles.tabIcon} />,
    },
  },
  Profile: {
    screen: Profile,
    navigationOptions: {
      tabBarLabel: 'Profile',
      tabBarIcon: ({ tintColor }) => <Icon name="ios-person" size={25} style={styles.tabIcon} />,
    },
  },
  Ranking: {
    screen: Ranking,
    navigationOptions: {
      tabBarLabel: 'Ranking',
      tabBarIcon: ({ tintColor }) => <Icon name="ios-stats" size={25} style={styles.tabIcon} />
    },
  },
  Notification: {
    screen: Notification,
    navigationOptions: {
      tabBarLabel: 'Notification',
      tabBarIcon: ({ tintColor }) => <Icon name="ios-notifications" size={25} style={styles.tabIcon} />
    },
  },
},
{
  tabBarPosition: 'bottom',
  animationEnabled: true,
  tabBarOptions: {
    upperCaseLabel: false,
    showIcon: true,
    style: {
      backgroundColor: '#222222',
    },
    tabStyle: {
      padding: 0
    },
    indicatorStyle: {
      backgroundColor: 'white'
    },
    iconStyle: {
      margin: 0
    },
    labelStyle: {
      fontSize: 10,
      color: 'white',
    },
  }
});

export const Base = StackNavigator({
  Stack: {
    screen: Stack,
  },
  Tab: {
    screen: Tab,
    navigationOptions: ({ navigation, screenProps }) => ({
      header: <MainHeader navigation={navigation}/>,
      headerLeft: null,
    }),
  },
  Quest: {
    screen: Quest,
    navigationOptions: {
      headerTintColor: '#ffffff',
      headerStyle: {
        backgroundColor: '#222222',
      },
      title: 'Quest',
    }
  },
  CreateQuest: {
    screen: CreateQuest,
    navigationOptions: {
      headerTintColor: '#ffffff',
      headerStyle: {
        backgroundColor: '#222222',
      }
    }
  },
  Todo: {
    screen: Todo,
    navigationOptions: {
      headerTintColor: '#ffffff',
      headerStyle: {
        backgroundColor: '#222222',
      }
    }
  },
  Achievements: {
    screen: Achievements,
    navigationOptions: {
      headerTintColor: '#ffffff',
      headerStyle: {
        backgroundColor: '#222222',
      }
    }
  },
  UserProfile: {
    screen: UserProfile,
    navigationOptions: {
      headerTintColor: '#ffffff',
      headerStyle: {
        backgroundColor: '#222222',
      }
    }
  },
});



const styles = StyleSheet.create({
  tabIcon: {
    color: "white",
  },
});