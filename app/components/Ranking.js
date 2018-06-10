import React from 'react'
import { StyleSheet,
         TextInput,
         View,
         ScrollView,
         RefreshControl,
         TouchableOpacity } from 'react-native'
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
         CardItem,
         Spinner } from 'native-base'
import { responsiveWidth,
         responsiveHeight,
         responsiveFontSize } from 'react-native-responsive-dimensions'
import { observer } from 'mobx-react'
import { RankingStore,
         UserProfileStore,
         UserStore } from '../mobx'
import moment from 'moment'
import images from '../../assets/img/images'
import firebase from 'react-native-firebase'
import Modal from 'react-native-modal'

@observer

export default class Ranking extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: "points",
      isModalVisible: false
    }
  }

  componentDidMount() {
    RankingStore.initRanking()
  }

  _onRefresh() {
    RankingStore.initRanking()
  }

  onValueChange(value) {
    this.setState({
      selected: value
    })

    RankingStore.sortRanking(value)
  }

  _toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }
  render () {
    var loading = <Spinner color='#66fcf1' />
    var ranking = RankingStore.users.map((item, i) => {
      return (
        <ListItem
          avatar
          key={i}
          style={styles.item}
          bordered
          button onPress={() => this.setUser(item._id)}>
            <Left>
              <Thumbnail small source={images[item.avatar]} />
            </Left>
            <Body>
              <Text style={styles.username}>{ item.username }</Text>
              <Text
                note
                style={styles.pointsRank}>
                  { item.points + " points | " + item.rank }
              </Text>
              <Text
                note
                style={styles.pointsRank}>
                  { item.experience + " experience | Level " + item.level }
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
      )
    }, this)

    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={RankingStore.loading}
              onRefresh={this._onRefresh.bind(this)}
            />}
        >
          <Card style={styles.card}>
            <CardItem style={{backgroundColor: 'transparent', flex: 1, flexDirection: "row"}}>
              <Left>
              <Text style={styles.sortBy}>Sort by : </Text>
              </Left>
              <Body>
              <Picker
                mode="dropdown"
                textStyle={{ color: "#5cb85c" }}
                style={{ width: responsiveWidth(50), color: "white" }}
                selectedValue={this.state.selected}
                onValueChange={this.onValueChange.bind(this)}
              >
                <Picker.Item color="#0b0c10" label="Points" value="points" />
                <Picker.Item color="#0b0c10" label="Experience" value="experience" />
              </Picker>
              </Body>
              <Right>
                <TouchableOpacity onPress={this._toggleModal}>
                  <Icon name="ios-bulb" style={{color: 'yellow'}}/>
                </TouchableOpacity>
                <Modal isVisible={this.state.isModalVisible}>
                  { this.renderModal() }
                </Modal>
              </Right>
            </CardItem>
          </Card>
          <Card style={styles.card}>
          { RankingStore.loading ? loading : ranking }
          </Card>
        </ScrollView>
      </View>
    )
  }

  renderModal = () => {
    return (
    <ScrollView>
      <Card style={{ flex: 1, backgroundColor: "white"}}>
        <CardItem>
          <Text style={styles.tipHeader}>Tip: Leaderboard</Text>
        </CardItem>
        <CardItem>
          <Text style={styles.tipContent}>
            {
              `Leaderboard displays ranking of users based on points and experience. To visit their profile by clicking their item.`
            }
          </Text>
        </CardItem>
        <CardItem>
          <Body>
            <TouchableOpacity onPress={this._toggleModal}>
              <Text style={styles.tipButton}>Hide me!</Text>
            </TouchableOpacity>
          </Body>
        </CardItem>
      </Card>
    </ScrollView>
    )
  }

  setUser = (user_id) => {
    UserStore.logEvent('VIEW_USER')
    UserProfileStore.setUser(user_id, this.props.navigation)
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
  }, 
  tipHeader: {
    textAlign: 'center',
    fontFamily: 'Gotham Bold',
    fontSize: 22,
    color: "#0b0c10"
  },

  tipContent: {
    fontFamily: "Proxima Nova Regular",
    fontSize: 18,
    color: "#0b0c10"
  },

  tipButton: {
    textAlign: 'center',
    fontFamily: "Gotham Bold",
    fontSize: 18,
    color: "#1f2833",
    width: responsiveWidth(80)
  }
})
