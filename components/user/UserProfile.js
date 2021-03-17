import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ScrollView} from 'react-native-gesture-handler';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      first_name: '',
      last_name: '',
      email: '',
      favourite_locations: [],
      reviews: [],
      liked_reviews: [],
    };
  }

  componentDidMount() {
    this._unsuscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.getData();
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

  getData = async () => {
    console.log('Get User Data: method called');
    var token = await AsyncStorage.getItem('@session_token');
    var id = await AsyncStorage.getItem('@user_id');
    console.log('Id:' + id + 'token:' + token);
    if (token !== null && id !== null) {
      console.log('Token gen:' + token);
      return fetch('http://10.0.2.2:3333/api/1.0.0/user/' + id, {
        headers: {'X-Authorization': token},
      })
        .then((res) => {
          if (res.status == 200) {
            return res.json();
          } else if (res.status == 401) {
            console.log('Unauthorised request');
            this.props.navigation.navigate('SignIn');
            throw 'Unauthorised Request';
          } else if (res.status == 404) {
            console.log('Not found: User data not found');
            throw 'User data not found';
          } else {
            throw 'Something is wrong somewhere';
          }
        })
        .then((res) => {
          console.log('Data:' + res);

          if (res != undefined) {
            console.log('Name:' + res.first_name + ' ' + res.last_name);
            console.log('Email:' + res.email);

            ToastAndroid.show('User data retrieved!', ToastAndroid.SHORT);
            this.setState({
              isLoading: false,
              first_name: res.first_name,
              last_name: res.last_name,
              email: res.email,
            });
          }
        })
        .catch((err) => {
          console.log('The error:' + err);
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
    } else {
      return (
        <ScrollView>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>
              {this.state.first_name} {this.state.last_name}
            </Text>
          </View>
          <View>
            <Text>First Name: {this.state.first_name}</Text>
            <Text>Last Name: {this.state.last_name}</Text>
            <Text>Email: {this.state.email}</Text>
          </View>
          <View>
            <Text>Favourite Locations</Text>
          </View>
          <View>
            <Text>Reviews</Text>
          </View>
          <View>
            <Text>Reviews Liked</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.navigate('UserUpdate')}>
            <Text style={styles.buttonText}> Update Profile </Text>
          </TouchableOpacity>
        </ScrollView>
      );
    }
  }
}

const styles = StyleSheet.create({
  titleWrapper: {
    flex: 0.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  title: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
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

export default UserProfile;
