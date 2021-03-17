//import MapView from 'react-native-maps';
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  ToastAndroid,
  Alert,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';

async function requestLocationPermission() {
  try {
    var granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'This app requires access to your location',
        buttonNeutral: 'Ask me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'Ok',
      },
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Location Access Granted!');
      return true;
    } else {
      console.log('Location Access Denied!');
      return false;
    }
  } catch (err) {
    console.log(err);
  }
}
class Mapping extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      location: null,
      locationPermission: false,
      latlong: null,
      latitude: null,
      longitude: null,
      region: null,
    };
  }

  componentDidMount() {
    this.unsuscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.findCoordinates();
  }

  componentWillUnmount() {
    this.unsuscribe();
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

  findCoordinates = () => {
    if (!this.state.locationPermission) {
      this.state.locationPermission = requestLocationPermission();
    }
    console.log(this.state);
    console.log('Find Location:method called');
    Geolocation.getCurrentPosition(
      (position) => {
        var newposition = JSON.stringify(position);
        console.log(newposition);
        console.log('whatttt');
        console.log(position.coords.latitude);
        this.setState({
          location: newposition,
          latlong: position.coords,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (err) => {
        console.log(err.message);
        Alert.alert(err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000,
      },
    );
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
        /*{  <Text>{this.state.location}</Text>}*/
        <View style={styles.container}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 90,
              longitude: 80,
              latitudeDelta: 0.002,
              longitudeDelta: 0.002,
            }}
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
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
});

export default Mapping;
