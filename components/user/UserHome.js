import React, {Component} from 'react';
import 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createStackNavigator} from '@react-navigation/stack';
import UserProfile from './UserProfile.js';
import UserUpdate from './UserUpdate.js';

class UserHome extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

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
    const Stack = createStackNavigator();
    return (
      <Stack.Navigator
        initialRouteName="UserProfile"
        screenOptions={{
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen
          name="UserProfile"
          component={UserProfile}
          options={{title: 'User'}}
        />
        <Stack.Screen name="UserUpdate" component={UserUpdate} />
      </Stack.Navigator>
    );
  }
}

export default UserHome;
