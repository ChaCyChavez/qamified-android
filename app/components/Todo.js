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
         Button } from 'native-base'
import { responsiveWidth,
         responsiveHeight,
         responsiveFontSize } from 'react-native-responsive-dimensions';

export default class Todo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    }
  }

  render () {
    const list = [
      {
        name: 'Amy Farha',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        subtitle: 'Vice President'
      },
      {
        name: 'Chris Jackson',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        subtitle: 'Vice Chairman'
      },
      {
        name: 'Amy Farha',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        subtitle: 'Vice President'
      },
      {
        name: 'Chris Jackson',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        subtitle: 'Vice Chairman'
      },
      {
        name: 'Amy Farha',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        subtitle: 'Vice President'
      },
      {
        name: 'Chris Jackson',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        subtitle: 'Vice Chairman'
      },
      {
        name: 'Amy Farha',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        subtitle: 'Vice President'
      },
      {
        name: 'Chris Jackson',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        subtitle: 'Vice Chairman'
      },
    ]

    var notifications = list.map((item, i) => {
      return (
        <ListItem
          avatar
          key={i}
          style={styles.item}>
            <Left>
              <Thumbnail source={{uri:this.state.avatar_url}} />
            </Left>
            <Body>
              <Text style={styles.title}>Kumar Pratik</Text>
              <Text
                note style={styles.description}>
                  Doing what you like will always keep you happy . .
              </Text>
            </Body>
            <Right>
              <Text
                note style={styles.status}>
                  3:43 pm
              </Text>
            </Right>
        </ListItem>
      );
    }, this);

    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
            { notifications }
        </ScrollView>
      </View>
    )
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
  item: {
    backgroundColor: "transparent",
    width: responsiveWidth(90),
  },
  subtitleView: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingTop: 5
  },
  ratingImage: {
    height: 19.21,
    width: 100
  },
  ratingText: {
    paddingLeft: 10,
    color: 'grey'
  },
  title: {
    fontFamily: "Gotham Bold",
    color: "#e5e6e7",
  },
  description: { 
    fontFamily: "Proxima Nova Regular",
    color: "#e5e6e7",
  },
  status: {
    fontFamily: "Proxima Nova Light",
    color: "#c5c6c7",
  },
});
