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
import MainHeader from '../components/MainHeader.js';
import Todo from '../components/Todo.js';
import Achievements from '../components/Achievements.js';
import Ranking from '../components/Ranking.js';
import UserProfile from '../components/UserProfile.js';
import SearchResult from '../components/SearchResult.js';
import Menu from '../components/Menu.js';
import firebase from 'react-native-firebase';
import { NotificationStore,
         UserStore } from '../mobx';

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

export const Tab = TabNavigator({
  Feed: {
    screen: Feed,
    navigationOptions: {
      tabBarLabel: 'Board',
      tabBarIcon: ({ tintColor }) => <Icon name="ios-home" size={25} style={styles.tabIcon} />,
    },
  },
  Profile: {
    screen: Profile,
    navigationOptions: {
      tabBarLabel: 'Headquarter',
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
      tabBarIcon: ({ tintColor }) => (
        <View>
          <Icon name="ios-notifications" size={25} style={styles.tabIcon} />
          {
            NotificationStore.hasUnreadNotif() ?
                <View style={styles.badge}>
                  <Text style={styles.badge_text}>!</Text>
                </View> :
                null
          }
        </View>)
    },
  },
},
{
  tabBarPosition: 'bottom',
  animationEnabled: true,
  navigationOptions: ({ navigation }) => ({
    tabBarOnPress: (scene, jumpToIndex) => {
      UserStore.logEvent('VIEW_' + navigation.state.key.toUpperCase())
      if(navigation.state.key === "Notification") {
        NotificationStore.new_notif = false
      }
      navigation.navigate(navigation.state.key)
    },
  }),
  tabBarOptions: {
    upperCaseLabel: false,
    showIcon: true,
    style: {
      backgroundColor: '#45a29e',
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
      fontFamily: "Proxima Nova Light",
    },
  },
  
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
      },
      title: 'Create Quest',
    }
  },
  Todo: {
    screen: Todo,
    navigationOptions: {
      headerTintColor: '#ffffff',
      headerStyle: {
        backgroundColor: '#222222',
      },
      title: 'Todo'
    }
  },
  Achievements: {
    screen: Achievements,
    navigationOptions: {
      headerTintColor: '#ffffff',
      headerStyle: {
        backgroundColor: '#222222',
      },
      title: 'Achievements'
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
  SearchResult: {
    screen: SearchResult,
    navigationOptions: {
      headerTintColor: '#ffffff',
      headerStyle: {
        backgroundColor: '#222222',
      },
      title: 'Search results'
    }
  },
  Menu: {
    screen: Menu,
    navigationOptions: {
      headerTintColor: '#ffffff',
      headerStyle: {
        backgroundColor: '#222222',
      },
      title: 'Menu'
    }
  },
});



const styles = StyleSheet.create({
  tabIcon: {
    color: "white",
  },
  badge: {
    position: 'absolute',
    right: -3,
    top: 3,
    backgroundColor: 'red',
    borderRadius: 12,
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  badge_text: {
    color: 'white',
    fontFamily: "Gothic Bold",
    fontSize: 12,
  }
});