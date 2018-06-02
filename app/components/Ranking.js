import React from 'react';
import { StyleSheet,
         TextInput,
         View,
         ScrollView } from 'react-native';
import { ListItem,
         Thumbnail,
         Body,
         Left,
         Right,
         Text,
         Button,
         Picker,
         Icon,
         Item,
         Card,
         CardItem } from 'native-base'
import { responsiveWidth,
         responsiveHeight,
         responsiveFontSize } from 'react-native-responsive-dimensions';
import { observer } from 'mobx-react';
import { RankingStore } from '../mobx';
import moment from 'moment';

@observer

export default class Ranking extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
      selected: "key1",
    }
  }

  componentDidMount() {
    RankingStore.initRanking()
  }

  onValueChange(value) {
    this.setState({
      selected: value
    });

    RankingStore.sortRanking(value)
  }

  render () {
    var ranking = RankingStore.users.map((item, i) => {
      return (
        <ListItem
          avatar
          key={i}
          style={styles.item}
          bordered>
            <Left>
              <Thumbnail small source={{uri:this.state.avatar_url}} />
            </Left>
            <Body>
              <Text style={styles.username}>{ item.username }</Text>
              <Text
                note
                style={styles.pointsRank}>
                  { item.points + " points | " + item.rank }
              </Text>
            </Body>
            <Right>
              <Text
                note
                style={styles.listRank}>
                  {`#${i + 1}`}
              </Text>
            </Right>
        </ListItem>
      );
    }, this);

    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <Card style={styles.card}>
            <CardItem style={{backgroundColor: 'transparent', flex: 1, flexDirection: "row"}}>
              <Left>
              <Text style={styles.sortBy}>Sort by : </Text>
              </Left>
              <Right>
              <Picker
                mode="dropdown"
                textStyle={{ color: "#5cb85c" }}
                style={{ width: responsiveWidth(50), color: "white" }}
                selectedValue={this.state.selected}
                onValueChange={this.onValueChange.bind(this)}
              >
                <Picker.Item color="#0b0c10" label="Points" value="key0" />
                <Picker.Item color="#0b0c10" label="Rank" value="key1" />
              </Picker>
              </Right>
            </CardItem>
          </Card>
          <Card style={styles.card}>
          { ranking }
          </Card>
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
  card: {
    backgroundColor: "#1f2833",
    borderColor: 'transparent',
  },
  item: {
    backgroundColor: "transparent",
    width: responsiveWidth(90),
  },
  username: {
    fontFamily: "Gotham Bold",
    color: "#c5c6c7",
    fontSize: 16,
  },
  pointsRank: {
    fontFamily: "Proxima Nova Light",
    color: "#c5c6c7",
    fontSize: 14,
  },
  listRank: {
    fontFamily: "Proxima Nova Light",
    color: "#c5c6c7",
    fontSize: 14,
  },
  sortBy: {
    color: "white",
    fontFamily: "Proxima Nova Regular"
  }
});
