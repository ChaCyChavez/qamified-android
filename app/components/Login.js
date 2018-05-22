import React from 'react';
import { StyleSheet,
         KeyboardAvoidingView,
         View, } from 'react-native';
import { responsiveHeight,
         responsiveWidth,
         responsiveFontSize } from 'react-native-responsive-dimensions';
import { Drawer,
         Text,
         Button,
         Container,
         Input,
         Item,
         Icon,
         Spinner} from 'native-base';
import { observer } from 'mobx-react';
import { LoginStore,
         UserStore } from '../mobx';

@observer

export default class Login extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      email_username: "",
      password: "",
    }
  }

  componentDidMount() {
    UserStore.isLoggedIn(this.props.navigation)
  }

  render() {
    if(Object.keys(UserStore.user).length === 0){
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
                <View>
                  <Item style={{marginBottom: 10}}>
                    <Input
                        style={styles.input}
                        placeholder='Email or Username'
                        underlineColorAndroid='transparent'
                        onChangeText={(input) => this.setState({email_username: input})}
                     />
                  </Item>
                  <Item style={{marginBottom: 10}}>
                    <Input
                        style={styles.input}
                        placeholder='Password'
                        secureTextEntry
                        underlineColorAndroid='transparent'
                        onChangeText={(input) => this.setState({password: input})}
                     />
                  </Item>
                  { LoginStore.error ? <Text style={styles.errorMessage}>{ LoginStore.error }</Text> : null }
                </View>
                { this.renderLoginButton() }
              <Button 
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
      )
    } else {
      return (
        <View style={styles.container}>
          <Spinner color='#66fcf1'/>
        </View>
      )
    }
  }

  completeField = () => {
    return (this.state.email_username &&
            this.state.password) ? true : false;
  }

  renderLoginButton = () => {
    if(LoginStore.loading) {
      return (
        <Button 
          block  
          style={styles.disabledLoginButton}
          disabled>
            <Text 
              uppercase={false}
              style={styles.loginText}>
                Loading...
            </Text>
        </Button>
      )
    }
    else if(!this.completeField()) {
      return (
        <Button 
          block 
          style={styles.disabledLoginButton}
          onPress={this.login}
          disabled>
            <Text 
              uppercase={false}
              style={styles.loginText}>
                Login
            </Text>
        </Button>
      )
    }
    return (
      <Button 
        block 
        style={styles.loginButton}
        onPress={this.login}>
          <Text 
            uppercase={false}
            style={styles.loginText}>
              Login
          </Text>
      </Button>
    )
  };
  
  navigateToRegister = () => {
    this.props.navigation.navigate('Register')
  }

  login = () => {
    LoginStore.login(this.props.navigation, this.state);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1f2833",
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    width: responsiveWidth(80)
  },
  title: {
    fontSize: 30,
    fontFamily: "Gotham Bold",
    color: '#e5e6e7',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 30,
    color: '#c5c6c7',
    fontFamily: "Proxima Nova Light",
  },
  input: {
    width: responsiveWidth(80),
    height: 44,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#1f2833',
    fontFamily: "Proxima Nova Regular",
  },
  loginButton: {
    width: responsiveWidth(80),
    backgroundColor: "#45a29e",
  },
  disabledLoginButton: {
    width: responsiveWidth(80),
    backgroundColor: "#b2d8d8",
  },
  loginText: {
    fontFamily: "Proxima Nova Regular",
  },
  registerButton: {
    fontSize: 14,
    color: '#e5e6e7',
    textDecorationLine: 'underline',
    fontFamily: "Proxima Nova Regular",
    textAlign: "center",
    width: responsiveWidth(80),
  },
  errorMessage: {
    textAlign: "center",
    fontSize: 14,
    color: "#ef0202",
    marginBottom: 10,
    fontFamily: "Proxima Nova Regular",
    color: "#f64c72",
  },
});
