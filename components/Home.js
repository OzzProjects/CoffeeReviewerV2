import React, {Component} from 'react';
import 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LogOut from './LogOut.js';
import UserHome from './user/UserHome.js';
import Mapping from './location/Mapping.js';
import LocationHome from './location/LocationHome.js';
import Camera from './Camera.js';

class Home extends Component {
  componentDidMount() {
    this._unsuscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
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
  render() {
    const Tab = createBottomTabNavigator();
    return (
      <Tab.Navigator initialRouteName="LocationHome" headerMode="none">
        <Tab.Screen name="LocationHome" component={LocationHome} />
        <Tab.Screen name="UserHome" component={UserHome} />
        <Tab.Screen name="Log Out" component={LogOut} />
      </Tab.Navigator>
    );
  }
}

export default Home;
