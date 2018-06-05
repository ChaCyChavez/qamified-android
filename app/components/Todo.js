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
import { observer } from 'mobx-react';
import { UserStore } from '../mobx';
import images from '../../assets/img/images'

@observer
export default class Todo extends React.Component {
  constructor(props) {
    super(props)
  }

  render () {
    var counter = 0
    var todos = UserStore.user.todos.map((item, i) => {
      if(i >= UserStore.user.current_todo - 1) {
        counter += 1
        return (
          <ListItem
            avatar
            key={i}
            style={styles.item}>
              <Left>
                <Thumbnail small square source={images['quest']} />
              </Left>
              <Body>
                <Text style={styles.title}>{ item.title }</Text>
                <Text
                  note style={styles.description}>
                    { item.description }
                </Text>
                <Text
                  note style={styles.description}>
                    { this.renderStatus(item.requirements) }
                </Text>
                <Text
                  note style={styles.status}>
                    { this.isComplete(item.requirements) ? "Note done" : "Done" }
                </Text>
              </Body>
          </ListItem>
        );
      }
    }, this);

    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
            { counter > 0 ? todos : <Text style={styles.noQuest}>No quest at the moment</Text> }
        </ScrollView>
      </View>
    )
  }

  renderStatus = (requirements) => {
    var requi = "\n"
    requirements.forEach(req => {
      requi += req.requirement + ": " + req.current + "/" + req.no + "\n"
    })

    return requi
  }

  isComplete = (requirements) => {
    requirements.forEach(req => {
      if(req.current != req.no) {
        return false
      }
    })

    return true
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
  noQuest: {
    marginTop: 10,
    textAlign: 'center',
    fontFamily: "Gotham Bold",
    color: "#252627",
    fontSize: 28,
  }
});
