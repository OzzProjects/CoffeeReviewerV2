import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ToastAndroid,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ScrollView} from 'react-native-gesture-handler';

class UserUpdate extends Component {
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
      og_first_name: '',
      og_last_name: '',
      og_email: '',
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
              og_first_name: res.first_name,
              og_last_name: res.last_name,
              og_email: res.email,
            });
          }
        })
        .catch((err) => {
          console.log('The error:' + err);
        });
    }
  };

  updateUser = async () => {
    console.log('Update User: method called');
    let to_send = {};
    if (this.state.first_name != this.state.og_first_name) {
      to_send.first_name = this.state.first_name;
    }
    if (this.state.last_name != this.state.og_last_name) {
      to_send.last_name = this.state.last_name;
    }
    if (this.state.email != this.state.og_email) {
      to_send.email = this.state.email;
    } 
    console.log(to_send);
    var token = await AsyncStorage.getItem('@session_token');
    var id = await AsyncStorage.getItem('@user_id');
    console.log('Id:' + id + 'token:' + token);
    if (token !== null) {
      return fetch('http://10.0.2.2:3333/api/1.0.0/user/' + id, {
        method: 'PATCH',
        headers: {
          'Content-type':'application/json',
          'X-Authorization': token},
        body: JSON.stringify(to_send),
      })
        .then((res) => {
          if (res.status == 200) {
            console.log('Updated User Profile');
            return res;
          } else if (res.status == 400) {
            console.log('Invalid Details');
            throw 'Invalid Details';
          } else if (res.status == 401) {
            this.props.navigation.navigate('SignIn');
            throw 'Unauthorised Request';
          } else if (res.status == 404) {
            console.log('Invalid user details');
            //this.props.navigation.navigate('SignIn');
            throw 'Invalid user details';
          } else {
            console.log('Something is wrong somewhere..');
            throw 'Something is wrong somewhere';
          }
        })
        .then((res) => {
          console.log('Data:' + res);

          if (res != undefined) {
            console.log(res);
            ToastAndroid.show('Updated Profile', ToastAndroid.SHORT);
          }
        })
        .catch((err) => {
          console.log('The error:' + err);
          ToastAndroid.show(err, ToastAndroid.SHORT);
        });
    }
  };

  render() {
    return (
      <ScrollView>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={styles.viewInput}>
            <Text>First Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={(first_name) => this.setState({first_name})}
              value={this.state.first_name}
            />
          </View>
          <View style={styles.viewInput}>
            <Text>Last Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={(last_name) => this.setState({last_name})}
              value={this.state.last_name}
            />
          </View>
          <View style={styles.viewInput}>
            <Text>Email</Text>
            <TextInput
              style={styles.input}
              onChangeText={(email) => this.setState({email})}
              value={this.state.email}
            />
          </View>
          <View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.updateUser()}>
              <Text style={styles.buttonText}> Submit </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
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

export default UserUpdate;
