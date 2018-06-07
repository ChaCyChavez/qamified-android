import React from 'react';
import { StyleSheet,
         TextInput,
         View,
         ScrollView } from 'react-native';
import { List,
         ListItem,
         Thumbnail,
         Body,
         Left,
         Right,
         Text,
         Button,
         Icon } from 'native-base'
import { responsiveWidth,
         responsiveHeight,
         responsiveFontSize } from 'react-native-responsive-dimensions';

import { FeedStore,
         UserStore } from '../mobx';
import { observer } from 'mobx-react';
import images from '../../assets/img/images'

@observer

export default class Menu extends React.Component {
  constructor(props) {
    super(props)

    
  }

  render () {
    const {goBack} = this.props.navigation;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <List>
            <ListItem itemHeader first>
              <Text style={styles.header}>Choose category</Text>
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
  }
});
