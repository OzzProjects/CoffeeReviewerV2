
import React, { Component } from 'react';
import 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import Mapping from './Mapping.js';
import {Image} from 'react-native';
import LocationItem from './LocationItem.js';
import LocationList from './LocationList.js';
class LocationHome extends Component {

    constructor(props) {
        super(props)
        this.state = {
        }

    }
    componentDidMount(){
      this._unsuscribe=this.props.navigation.addListener('focus',()=>{
        this.checkLoggedIn();
      })    
    };
    
    componentWillUnmount(){
      this._unsuscribe();
    }
    
    checkLoggedIn =  async () =>{
      try {
          var token = await AsyncStorage.getItem('@session_token');
  
          if (token == null) {
            this.props.navigation.navigate("SignIn");
          }
        } catch (err) {
          throw "Async has err:" + err;
      }
    }

    render() { 
      const Stack=createStackNavigator();
      return (
          <Stack.Navigator initialRouteName="LocationList" 
            screenOptions={{
              headerStyle: {
                backgroundColor: 'black',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              }
            }}
          >
           <Stack.Screen name="LocationList" component={LocationList} 
           options={{ title:'LocationList'}}/>
           <Stack.Screen name="LocationItem" component={LocationItem}/>
          </Stack.Navigator>
      );
    
      }
      // <Image style={{flex:1, height:undefined,width:undefined}}
      // source={require('../images/coffee_icon.png')} resizeMode="contain" />
      // }}/>
}
export default LocationHome;