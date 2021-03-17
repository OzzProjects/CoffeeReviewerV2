
import React, {Component} from 'react';
import {StyleSheet,View,TouchableOpacity,ToastAndroid,Text,Button} from 'react-native';
import 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ScrollView} from 'react-native-gesture-handler';
import { RNCamera } from 'react-native-camera';

class Camera extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      review_id:'',
      location_id:'',
      location_name:'',
      location_reviews:''

   };
  }

  componentDidMount() {
    this._unsuscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });

    }
    
  componentWillUnmount(){
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
    console.log('Get Location Data: method called');
    var token = await AsyncStorage.getItem('@session_token');
    console.log('Token:' + token);
    var id = this.state.location_id;
    console.log('Location Id:' + id);
    if (token !== null) {

       return fetch('http://10.0.2.2:3333/api/1.0.0/location/' + id,{
        headers: {'X-Authorization': token},
      })
        .then((res) => {
          if (res.status == 200) {
            return res.json();
          } else if (res.status == 404) {
            console.log('Location Not Found');
            throw 'Location Not Found';
          } else {
            throw 'Something is wrong somewhere';
          }
        })
        .then((res) => {
          console.log('Data:' + res);

          if (res != undefined) {
            console.log('Name:' + res.location_name + ' ' + res.location_id);
            console.log('Reviews'+res.location_reviews);
            ToastAndroid.show('Location data retrieved!', ToastAndroid.SHORT);
            this.setState({
              location_id:res.location_id,
              location_name: res.location_name,
              location_reviews:res.location_reviews

            });
          }
        })
        .catch((err) => {
          console.log('The error:' + err);
        });
    }
  };

  takePicture = async()=>{
    if(this.camera){
      const options={quality:0.5, base64:true}
      const data = await this.camera.takePictureAsync(options);
      console.log("Camera Data:"+data.uri);
      const id = this.state.location_id;
      const reviewId=this.state.review_id;
      console.log('Location Id:' + id);
      if (token !== null) {
      
      return fetch(
        'http://10.0.2.2:3333/api/1.0.0/location/' + id + '/review/'+review_id+'photo',
        {
          method: 'POST',
          headers: {
              "Content-Type":"image/jpeg",
              'X-Authorization': token}
        },
      )
        .then((res) => {
          if (res.status == 200){
            console.log('Add Photo Request success');
            ToastAndroid.show('Added Favourite Location ', ToastAndroid.SHORT);
          } else if (res.status == 401) {
            throw 'Unauthorised Request';
          }
          else if (res.status == 404){
            console.log('Photo Not Found');
            throw 'Photo Not Found';
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
     

    }
  };

 
  render() {
    return (
        <View style={{flex:1,width:'100%'}}>
            <RNCamera
            ref={ref => {
            this.camera = ref;
            }}
            style={styles.preview}>
        </RNCamera>

        <TouchableOpacity
              style={styles.button}
              onPress={() => this.takePicture()}>
               <Text>Take Picture</Text>
          </TouchableOpacity>

        </View>

    );  
  }
}



const styles = StyleSheet.create({
 preview:{
    flex: 1,
    justifyContent:'flex-end',
    alignItems:'center',
    width: '100%'
 },
 button: {
    margin: 10,
    padding: 5,
    backgroundColor: '#000000',
  }
});

export default Camera;
