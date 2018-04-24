import React from 'react';
import { StackNavigator } from 'react-navigation';
import { Base, Stack } from './app/config/router.js';
import { Root } from 'native-base';

export default class App extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Root>
        <Base></Base>
      </Root>
    );
  }
}
