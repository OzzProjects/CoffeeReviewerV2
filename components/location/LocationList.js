import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ToastAndroid,
  FlatList,
  TouchableOpacity,
  Image
} from 'react-native';
import 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LocationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      locations: null,
    };
  }

  componentDidMount() {
    this._unsuscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.findLocations();
  }

  componentWillUnmount() {
    this._unsuscribe();
  }

  checkLoggedIn = async () => {
    try {
      var token = await AsyncStorage.getItem('@session_token');

      if (token == null) {
        this.props.navigation.navigate('SignIn');
      }
    } catch (err) {
      throw 'Async has err:' + err;
    }
  };

  findLocations = async () => {
    console.log('Find Locations: method called');
    var token = await AsyncStorage.getItem('@session_token');
    if (token !== null) {
      console.log('Token gen:' + token);
      return fetch('http://10.0.2.2:3333/api/1.0.0/find', {
        headers: {'X-Authorization': token},
      })
        .then((res) => {
          if (res.status == 200) {
            console.log('Locations Success Request');
            return res.json();
          } else if (res.status == 401) {
            this.props.navigation.navigate('SignIn');
            throw 'Unauthorised Request';
          } else if (res.status == 400) {
            console.log('Bad request: Something gone wrong on the frontend');
            throw 'Something gone wrong on the frontend';
          } else {
            throw 'Something is wrong somewhere';
          }
        })
        .then((res) => {
          console.log('Data:' + res);

          if (res != undefined) {
            console.log('Id:' + res[0].location_id);
            console.log('Name:' + res[0].location_name);

            ToastAndroid.show('Location data retrieved!', ToastAndroid.SHORT);
            this.setState({
              isLoading: false,
              locations: res,
            });
          }
        })
        .catch((err) => {
          console.log('The error:' + err);
          ToastAndroid.show(err, ToastAndroid.SHORT);
        });
    }
  };

  favouriteLocation = async (id) => {
    console.log('Favourite Location: method called');
    var token = await AsyncStorage.getItem('@session_token');
    console.log('Token:' + token);
    console.log('Location Id:' + id);
    if (token !== null) {
      return fetch(
        'http://10.0.2.2:3333/api/1.0.0/location/' + id + '/favourite',
        {
          method: 'POST',
          headers: {'X-Authorization': token},
        },
      )
        .then((res) => {
          if (res.status == 200){
            console.log('Favourite Location Request success');
            ToastAndroid.show('Added Favourite Location ', ToastAndroid.SHORT);
          } else if (res.status == 401) {
            throw 'Unauthorised Request';
          }
          else if (res.status == 404){
            console.log('Location Not Found');
            throw 'Location Not Found';
          }
          else if (res.status == 400){
            console.log('Something gone wrong on the frontend');
            throw 'Something gone wrong on the frontend';
          } else {
            throw 'Something is wrong somewhere';
          }
        })
        .catch((err) => {
          console.log('The error:'+err);
          ToastAndroid.show(err, ToastAndroid.SHORT);
        });
    }
  };

  unfavouriteLocation = async (id) => {
    console.log('Unfavourite Location: nmethod called');
    var token = await AsyncStorage.getItem('@session_token');
    console.log('Token:' + token);
    console.log('Location Id:' + id);
    if (token !== null) {
      return fetch(
        'http://10.0.2.2:3333/api/1.0.0/location/' + id + '/favourite',
        {
          method: 'DELETE',
          headers: {'X-Authorization': token},
        },
      )
        .then((res) => {
          if (res.status == 200){
            console.log('UnFavourite Location Request success');
            ToastAndroid.show('Deleted Favourite Location ', ToastAndroid.SHORT);
          } else if (res.status == 401) {
            throw 'Unauthorised Request';
          }
          else if (res.status == 404){
            console.log('Location Not Found');
            throw 'Location Not Found';
          }
          else if (res.status == 400){
            console.log('Something gone wrong on the frontend');
            throw 'Something gone wrong on the frontend';
          } else {
            throw 'Something is wrong somewhere';
          }
        })
        .catch((err) => {
          console.log('The error:' + err);
          ToastAndroid.show(err, ToastAndroid.SHORT);
        });
    }
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    } else if (this.state.locations != null) {
      return (
        <View style={styles.body}>
          <View style={styles.banner}>
            <Text style={styles.headingTitle}>Locations</Text>
          </View>
          <View>
            <FlatList
              data={this.state.locations}
              renderItem={({item}) => (
                <View style={styles.item}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('LocationItem', {
                        id: item.location_id,
                      })
                    }>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                      <Text style={{margin: 20}}></Text>
                      <Text style={styles.title}>
                        {item.location_name}
                      </Text>
                    </View>
                    <View style={styles.imageWrapper}>
                       <Image style={styles.image}/>
                       <Text>{item.photo_path}</Text>
                    </View>
                    <View>
                      <TouchableOpacity
                         style={styles.button}
                         onPress={() => this.favouriteLocation(item.location_id)}>
                          <Text style={styles.buttonText}> Add Favourite </Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item) => item.location_id.toString()}
            />
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.body}>
          <View style={styles.banner}>
            <Text style={styles.headingtext}>Locations</Text>
          </View>
          <Text style={[styles.averagetext, styles.grey]}>
            No Locations available
          </Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  image:{
      flex: 1,
      width: 150,
      height: 150,
      resizeMode: 'contain' 
  },
  imageWrapper:{
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
    height:150,
    margin:5,
    maxHeight:'100%',
    maxWidth:'100%',
    backgroundColor:'#DCDCDC'
  },
  body: {
    backgroundColor: '#F0F0F0',
    flex: 1,
  },
  item: {
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 5,

  },
  banner: {
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 5,
  },
  headingTitle: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
  },
  title: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  grey: {
    color: '#505050',
  },
  viewInput: {
    flex: 0.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  input: {
    borderWidth: 1,
    margin: 10,
    padding: 10,
  },
  button: {
    margin: 10,
    padding: 5,
    backgroundColor: '#000000',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default LocationList;
