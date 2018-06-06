import React from 'react';
import { StyleSheet,
         View,
         ScrollView,
         KeyboardAvoidingView,
         TouchableHighlight } from 'react-native';
import { responsiveHeight,
         responsiveWidth,
         responsiveFontSize } from 'react-native-responsive-dimensions';
import { Item,
         Input,
         Button, 
         Text,
         Icon, 
         Thumbnail } from 'native-base';
import { observer } from 'mobx-react';
import { RegisterStore } from '../mobx';
import moment from 'moment';
import images from '../../assets/img/images';

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
      avatar: "man"
    }
  };

  render() {
    return (
      <ScrollView style={{"backgroundColor": "#1f2833", height: responsiveHeight(100)}} contentContainerstyle={styles.scrollView}>
        <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
            <Thumbnail
              source={images['qamified-logo']} />
            <Text 
              style={styles.title }>
                QAmifiED
            </Text>
            <Text
              style={styles.subtitle}>
                A Question and Answer Platform
            </Text>
            { this.renderForm() }
            <View style={styles.buttonSection}>
              { this.renderPageButton() }
              { RegisterStore.error ? <Text style={styles.errorMessage}>{ RegisterStore.error }</Text> : null }
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
        </ScrollView>
    );
  };

  renderPageButton = () => {
    if(this.state.page === 1) {
      return (
        <View style={styles.pageButton}>
            <Button small disabled style={styles.disabledNextPrevButton}>
              <Icon name="arrow-back" size={24} color="white"/>
            </Button>
            <Text> &nbsp; </Text>
            <Button small onPress={this.nextPage}  style={styles.nextPrevButton}>
              <Icon name="arrow-forward" size={24} color="white"/>
            </Button>
        </View>
      );
    }
    else {
      return (
        <View style={styles.pageButton}>
            <Button small onPress={this.backPage} style={styles.nextPrevButton}>
              <Icon name="arrow-back" size={24} color="white"/>
            </Button>
            <Text> &nbsp; </Text>
            <Button small disabled style={styles.disabledNextPrevButton}>
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
          <Item style={styles.chooseAvatar}>
            <TouchableHighlight onPress={() => this.setState({avatar: "man"})} style={{margin: 2, backgroundColor: (this.state.avatar == "man") ? "white" : "transparent"}}>
              <Thumbnail source={images['man']} />
            </TouchableHighlight>
            <TouchableHighlight onPress={() => this.setState({avatar: "boy"})} style={{margin: 2, backgroundColor: (this.state.avatar == "boy") ? "white" : "transparent"}}>
              <Thumbnail source={images['boy']} />
            </TouchableHighlight>
            <TouchableHighlight onPress={() => this.setState({avatar: "woman"})} style={{margin: 2, backgroundColor: (this.state.avatar == "woman") ? "white" : "transparent"}}>
              <Thumbnail source={images['woman']} />
            </TouchableHighlight>
            <TouchableHighlight onPress={() => this.setState({avatar: "girl"})} style={{margin: 2, backgroundColor: (this.state.avatar == "girl") ? "white" : "transparent"}}>
              <Thumbnail source={images['girl']} />
            </TouchableHighlight>
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
          style={styles.disabledRegisterButton}
          disabled>
            <Text
              uppercase={false}
              style={styles.registerText}>
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
          style={styles.disabledRegisterButton}
          disabled>
            <Text
              uppercase={false}
              style={styles.registerText}>
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
      date_created: moment().format(),
      level_exp: 50,
      current_todo: 1,
      avatar: this.state.avatar
    }
    RegisterStore.register(this.props.navigation, user, this.state.password);
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f2833',
    alignItems: 'center',
    height: responsiveHeight(100),
    justifyContent: 'center',
  },
  scrollView: { 
    flexGrow: 1,
    backgroundColor: '#1f2833',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: "Gotham Bold",
    color: "#e5e6e7",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 30,
    fontFamily: "Proxima Nova Light",
    color: "#c5c6c7",
  },
  header: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: "Gotham Bold",
    color: "#e5e6e7",
  },
  form: {
    width: responsiveWidth(80)
  },
  input: {
    width: responsiveWidth(80),
    height: 44,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#1f2833',
    fontFamily: "Proxima Nova Regular",
  },
  buttonSection: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageButton: {
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  loginButton: {
    fontSize: 14,
    color: '#e5e6e7',
    textDecorationLine: 'underline',
    fontFamily: "Proxima Nova Regular",
  },
  registerButton: {
    width: responsiveWidth(80),
    backgroundColor: "#45a29e",
  },
  disabledRegisterButton: {
    width: responsiveWidth(80),
    backgroundColor: "#b2d8d8",
  },
  registerText: {
    fontFamily: "Proxima Nova Regular",
  },
  nextPrevText: {
    fontFamily: "Proxima Nova Regular",
  },
  nextPrevButton: {
    backgroundColor: "#45a29e",
  },
  disabledNextPrevButton: {
    backgroundColor: "#b2d8d8",
  },
  errorMessage: {
    textAlign: "center",
    fontSize: 14,
    color: "#ef0202",
    marginBottom: 10,
    fontFamily: "Proxima Nova Regular",
    color: "#f64c72",
  },
  chooseAvatar: {
    borderColor: "transparent",
    justifyContent: "center",
  }
});
