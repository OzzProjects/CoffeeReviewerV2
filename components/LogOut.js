import {Component} from 'react';
import {ToastAndroid} from 'react-native';

import 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
class LogOut extends Component {
  componentDidMount() {
    this._unsuscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.logOut();
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

  logOut = async () => {
    console.log('LogOut: method called');
    var token = await AsyncStorage.getItem('@session_token');
    if (token !== null) {
      console.log('Token gen:' + token);
      return fetch('http://10.0.2.2:3333/api/1.0.0/user/logout', {
        method: 'POST',
        headers: {'X-Authorization': token},
      })
        .then((res) => {
          if (res.status === 200) {
            console.log('Logging Out');
            return res;
          } else if (res.status === 401) {
            this.props.navigation.navigate('SignIn');
            throw 'Unauthorised request';
          } else {
            throw 'Something is wrong somewhere';
          }
        })
        .then((res) => {
          console.log('Data:' + res);

          if (res !== undefined) {
            ToastAndroid.show('Logged Out', ToastAndroid.SHORT);
            this.props.navigation.navigate('SignIn');
          }
        })
        .catch((err) => {
          console.log('The error:' + err);
          ToastAndroid.show(err, ToastAndroid.SHORT);
        });
    }
  };

  render() {
    return null;
  }
}

export default LogOut;
