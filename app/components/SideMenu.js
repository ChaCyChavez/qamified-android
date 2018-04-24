import React from 'react';
import {NavigationActions} from 'react-navigation';
import {ScrollView, Text, View, Button } from 'react-native';

export default class SideMenu extends React.Component {
  navigateToScreen = (route, category) => () => {
    this.props.navigation.navigate(route, {category: category});
  }
  
  render () {
    return (
      <View>
        <ScrollView>
          <View>
            <Button onPress={this.navigateToScreen('Category_1', "1")} title="1"/>
            <Button onPress={this.navigateToScreen('Category_1', "2")} title="2"/>
            <Button onPress={this.navigateToScreen('Category_1', "3")} title="3"/>
            <Button onPress={this.navigateToScreen('Login', "")} title="Logout"/>
          </View>
        </ScrollView>
      </View>
    );
  }
}