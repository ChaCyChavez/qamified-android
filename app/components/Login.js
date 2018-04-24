import React from 'react';
import { StyleSheet,
         KeyboardAvoidingView,
         View } from 'react-native';
import { responsiveHeight,
         responsiveWidth,
         responsiveFontSize } from 'react-native-responsive-dimensions';
import { Drawer,
         Text,
         Button,
         Container,
         Input,
         Item,
         Icon } from 'native-base';
import firebase from 'react-native-firebase';
import { observer } from 'mobx-react';
import Store from '../mobx/Store.js';

@observer

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email_username: "",
      password: "",
    }
  }

  render() {
    
    return (
      <KeyboardAvoidingView 
        behavior="padding" 
        style={styles.container}>
          <Text 
            style={styles.title}>
              QAmifiED
          </Text>
          <Text 
            style={styles.subtitle}>
              A Question and Answer Platform
          </Text>
          <View 
            style={styles.form}>   
              { this.renderForm() }
              { this.renderLoginButton() }
            <Button 
              block 
              transparent 
              onPress={this.navigateToRegister}>
                <Text 
                  uppercase={false} 
                  style={styles.registerButton}>
                    Not a member? Register.
                </Text>
            </Button>
          </View>
      </KeyboardAvoidingView>
    );
  }

  navigateToRegister = () => {
    this.props.navigation.navigate('Register')
  };

  login = () => {
    Store.login(this.props.navigation, this.state);
  };

  renderLoginButton = () => {
    if(Store.loginState.loading) {
      return (
        <Button 
          block 
          dark 
          style={styles.loginButton}
          disabled>
            <Text 
              uppercase={false}>
                Loading...
            </Text>
        </Button>
      )
    }
    return (
      <Button 
        block 
        dark
        style={styles.loginButton}
        onPress={this.login}>
          <Text 
            uppercase={false}>
              Login
          </Text>
      </Button>
    )
  };

  renderForm = () => {
    if(Store.loginState.error) {
      return (
        <View>
          <Item error style={{marginBottom: 10}}>
            <Input
                style={styles.input}
                placeholder='Email or Username'
                underlineColorAndroid='transparent'
                onChangeText={(input) => this.setState({email_username: input})}
             />
          </Item>
          <Item error style={{marginBottom: 10}}>
            <Input
                style={styles.input}
                placeholder='Password'
                secureTextEntry
                underlineColorAndroid='transparent'
                onChangeText={(input) => this.setState({password: input})}
             />
          </Item>
          <Text style={styles.errorMessage}>{ Store.loginState.error }</Text>
        </View>
      )
    }
    return (
      <View>
        <Item style={{marginBottom: 8}}>
          <Input
              style={styles.input}
              placeholder='Email or Username'
              underlineColorAndroid='transparent'
              onChangeText={(input) => this.setState({email_username: input})}
           />
        </Item>

        <Item style={{marginBottom: 8}}>
          <Input
              style={styles.input}
              placeholder='Password'
              secureTextEntry
              underlineColorAndroid='transparent'
              onChangeText={(input) => this.setState({password: input})}
           />
        </Item>
      </View>
    )
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E7ECEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    width: responsiveWidth(80)
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#222222',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 30,
    color: '#444444',
  },
  input: {
    width: responsiveWidth(80),
    height: 44,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#111111',
  },
  label: {
    margin: 10,
    color: '#111111',
  },
  loginButton: {
    width: responsiveWidth(80),
  },
  registerButton: {
    fontSize: 14,
    color: '#222222',
    textDecorationLine: 'underline',
  },
  errorMessage: {
    textAlign: "center",
    fontSize: 14,
    color: "#ef0202",
    marginBottom: 10,
  },
});
