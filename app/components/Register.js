import React from 'react';
import { StyleSheet,
         View,
         KeyboardAvoidingView,
         ScrollView } from 'react-native';
import { responsiveHeight,
         responsiveWidth,
         responsiveFontSize } from 'react-native-responsive-dimensions';
import { Item,
         Input,
         Button, 
         Text,
         Icon } from 'native-base';
import { observer } from 'mobx-react';
import { RegisterStore } from '../mobx';
import moment from 'moment';

@observer

export default class Register extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      first_name: "",
      mid_name: "",
      last_name: "",
      email: "",
      username: "",
      password: "",
      institution: "",

      page: 1,
    }
  };

  render() {
    return (
      <KeyboardAvoidingView 
        behavior="padding"
        style={styles.container}>
          <View>
            <Text 
              style={styles.title }>
                QAmifiED
            </Text>
            <Text
              style={styles.subtitle}>
                A Question and Answer Platform
            </Text>
          </View>
          { this.renderForm() }
          <View style={styles.buttonSection}>
            { this.renderErrorMessage() }
            { this.renderPageButton() }
            { this.renderRegisterButton() }
          </View>
        <Button 
          block 
          transparent
          onPress={this.navigateToLogin}>
            <Text 
              uppercase={false}
              style={styles.loginButton}>
                Already a member? Login.
            </Text>
        </Button>
      </KeyboardAvoidingView>
    );
  };

  renderPageButton = () => {
    if(this.state.page === 1) {
      return (
        <View style={styles.pageButton}>
            <Button small disabled iconLeft>
              <Icon name="arrow-back" size={24} color="white"/>
              <Text uppercase={false}>Back</Text>
            </Button>
            <Button small onPress={this.nextPage} iconRight>
              <Text uppercase={false}>Next</Text>
              <Icon name="arrow-forward" size={24} color="white"/>
            </Button>
        </View>
      );
    }
    else {
      return (
        <View style={styles.pageButton}>
            <Button small onPress={this.backPage} iconLeft>
              <Icon name="arrow-back" size={24} color="white"/>
              <Text uppercase={false}>Back</Text>
            </Button>
            <Button small disabled iconRight>
              <Text uppercase={false}>Next</Text>
              <Icon name="arrow-forward" size={24} color="white"/>
            </Button>
        </View>
      );
    }
  };

  nextPage = () => {
    this.setState({page: 2})
  };

  backPage = () => {
    this.setState({page: 1})
  };

  renderForm = () => {
    if(this.state.page === 1) {
      return (
      <View 
        style={styles.form}>
          <Text style={styles.header}>Credentials</Text>
          <Item 
            style={{marginBottom: 10}}>
              <Input
                  style={styles.input}
                  placeholder='Email'
                  underlineColorAndroid='transparent'
                  onChangeText={(input) => this.setState({email: input})}
                  value={this.state.email}
               />
          </Item>
          <Item 
            style={{marginBottom: 10}}>  
            <Input
                style={styles.input}
                placeholder='Username'
                underlineColorAndroid='transparent'
                onChangeText={(input) => this.setState({username: input})}
                value={this.state.username}
             />
          </Item>
          <Item 
            style={{marginBottom: 10}}>
              <Input
                  style={styles.input}
                  placeholder='Password'
                  secureTextEntry
                  underlineColorAndroid='transparent'
                  onChangeText={(input) => this.setState({password: input})}
                  value={this.state.password}
               />
          </Item>
          
      </View>
    )
    }
    else {
      return (
        <View 
        style={styles.form}>
          <Text style={styles.header}>Personal Information</Text>
          <Item 
            style={{marginBottom: 10}}>
              <Input
                  style={styles.input}
                  placeholder='First name'
                  underlineColorAndroid='transparent'
                  onChangeText={(input) => this.setState({first_name: input})}
                  value={this.state.first_name}
               />
          </Item>
          <Item 
            style={{marginBottom: 10}}>
              <Input
                  style={styles.input}
                  placeholder='Middle name'
                  underlineColorAndroid='transparent'
                  onChangeText={(input) => this.setState({mid_name: input})}
                  value={this.state.mid_name}
               />
          </Item>
          <Item 
            style={{marginBottom: 10}}>
              <Input
                  style={styles.input}
                  placeholder='Last name'
                  underlineColorAndroid='transparent'
                  onChangeText={(input) => this.setState({last_name: input})}
                  value={this.state.last_name}
               />
          </Item>
          <Item 
            style={{marginBottom: 10}}>
              <Input
                  style={styles.input}
                  placeholder='Institution'
                  underlineColorAndroid='transparent'
                  onChangeText={(input) => this.setState({institution: input})}
                  value={this.state.institution}
               />
          </Item>
      </View>
      )
    }
  };

  completeField = () => {
    return (this.state.first_name &&
            this.state.mid_name &&
            this.state.last_name &&
            this.state.institution &&
            this.state.email &&
            this.state.username &&
            this.state.password) ? true : false;
  };

  renderRegisterButton = () => {
    if(RegisterStore.loading) {
      return (
        <Button 
          block 
          dark
          style={styles.registerButton}
          disabled>
            <Text
              uppercase={false}>
                Loading...
            </Text>
        </Button>
      )
    }
    else if(!this.completeField()) {
      return (
        <Button
          block
          dark
          style={styles.registerButton}
          disabled>
            <Text
              uppercase={false}>
                Register
            </Text>
        </Button>
      )
    }
    return (
      <Button
        block
        dark
        style={styles.registerButton}
        onPress={this.register}>
          <Text
            uppercase={false}>
              Register
          </Text>
      </Button>
    )
  };

  renderErrorMessage = () => {
    return(
      <Text>{RegisterStore.error}</Text>
    )
  };

  navigateToLogin = () => {
    this.props.navigation.navigate('Login');
  };

  register = () => {
    var user = {
      first_name: this.state.first_name,
      middle_name: this.state.mid_name,
      last_name: this.state.last_name,
      institution: this.state.institution,
      email: this.state.email,
      username: this.state.username,
      description: "",
      achievements: {},
      points: 0,
      experience: 0,
      level: 1,
      rank: "Beginner",
      date_created: moment().format()
    }
    RegisterStore.register(this.props.navigation, user, this.state.password);
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E7ECEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 30,
  },
  header: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  form: {
    width: responsiveWidth(80)
  },
  input: {
    width: responsiveWidth(80),
    height: 44,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#111111',
  },
  buttonSection: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  pageButton: {
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  loginButton: {
    fontSize: 14,
    color: '#222222',
    textDecorationLine: 'underline',
  },
  registerButton: {
    width: responsiveWidth(80),
  },
});
