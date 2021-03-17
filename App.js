/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  StyleSheet,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignIn from'./components/SignIn.js';
import SignUp from'./components/SignUp.js';
import Home from'./components/Home.js';
import Logout from'./components/LogOut.js';
const App=()=> {

  const Stack=createStackNavigator();
  return (
 
    <NavigationContainer >
      <Stack.Navigator initialRouteName="SignIn"  headerMode="none">
       <Stack.Screen  name="SignIn" component={SignIn}/>
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="SignUp" component={SignUp} options={{title: 'Sign Up'}}/>
        <Stack.Screen name="LogOut" component={Logout} />
      </Stack.Navigator>
    </NavigationContainer>  
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  navButtons:{
    flex:1,
    width:'33.3%'
  }
});

export default App;
