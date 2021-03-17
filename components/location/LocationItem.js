import React, {Component} from 'react';
import {StyleSheet,Switch, View, Text, Image,TouchableOpacity,ToastAndroid,FlatList} from 'react-native';
import 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
class LocationItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showReviews:true,
      isFavourite:true,
      location_id: this.props.route.params.id,
      location_name: '',
      location_path:'',
      local_path:'',
      location_reviews:[],
      rlocation_reviews:[{id:1,value:"Orange"},{id:2,value:"apples"},{id:3,value:"Dinaosures"}],
      location_overall:null,
      location_price:null,
      location_quality:null,
      location_clean:null,
      location_reviewText:'',
      add_overall:null,
      add_price:null,
      add_quality:null,
      add_clean:null,
      add_reviewText:''

      
    };
  }

  componentDidMount() {
    this._unsuscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.getData();
    console.log('Params:'+this.props.route.params);
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
              location_name: res.location_name,
              location_reviews:res.location_reviews,
              location_path:res.photo_path
            });
            this.checkLocationName(res.location_id);

          }
        })
        .catch((err) => {
          console.log('The error:' + err);
        });
    }
  };

  checkLocationName=(id)=>{
    console.log(id);
    if(id===1){
      this.setState({local_path:'/images/sheep_coffee'});
    }
    else if(id===2){
      this.setState({local_path:'/images/vienna_coffee'});
    }
    else if(id===3){
      this.setState({local_path:'/images/hampton_coffee'});
    }
    else if(id===4){
      this.setState({local_path:'/images/ditto_coffee'});
    }
    else if(id===5){
      this.setState({local_path:'/images/foundation_coffee'});
    }
    console.log("Local: "+this.state.local_path);

  }
  addNewReview=async()=>{
    console.log('Add New Review: method called');
    var token = await AsyncStorage.getItem('@session_token');
    var id = this.state.location_id;
    console.log("Token:"+token+" Location Id "+id);
    let obj = {
      overall_rating: parseInt(this.state.add_overall),
      price_rating: parseInt(this.state.add_price),
      quality_rating: parseInt(this.state.add_quality),
      clenliness_rating: parseInt(this.state.add_clean),
      review_body:this.state.add_reviewText
    };
    console.log(obj);
    if (token !== null && id!==null) {
      return fetch(
        'http://10.0.2.2:3333/api/1.0.0/location/' + id + '/review',
        {
          method: 'POST',
          headers: {
            "Content-Type":'application/json',
            'X-Authorization': token},
            body:JSON.stringify(obj)
        },
      )
        .then((res) => {
          if (res.status == 201){
            console.log('Created Review Sucess!');
            return res;
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
        .then((res) => {
          console.log('Data:' + res);
  
          if (res !== undefined) {
            ToastAndroid.show('Created Review', ToastAndroid.SHORT);
          }
        })
        .catch((err) => {
          console.log('The error:'+err);
          ToastAndroid.show(err, ToastAndroid.SHORT);
        });
    }
  };

  deleteReview = async (review_id) => {
    console.log('Delete Review: nmethod called');
    var token = await AsyncStorage.getItem('@session_token');
    var id = this.state.location_id;
    console.log("Token:"+token+"Location id "+id+" review:"+review_id);
    if (token !== null && id!==null) {
      return fetch(
        'http://10.0.2.2:3333/api/1.0.0/location/' + id + '/review/'+review_id,
        {
          method: 'DELETE',
          headers: {'X-Authorization': token},
        },
      )
        .then((res) => {
          if (res.status == 200){
            console.log('Delete Review Request success');
            ToastAndroid.show('Deleted review ', ToastAndroid.SHORT);
          } else if (res.status == 401) {
            throw 'Unauthorised Request';
          }
          else if (res.status == 404){
            console.log('Review Not Found');
            throw 'Review Not Found';
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

  favouriteLocation =async()=>{
    console.log('Favourite Location: method called');
    var token = await AsyncStorage.getItem('@session_token');
    var id = this.state.location_id;
    console.log("Token:"+token+" Location Id "+id);
    if (token !== null && id!==null) {
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

  unfavouriteLocation = async () => {
    console.log('Unfavourite Location: nmethod called');
    var token = await AsyncStorage.getItem('@session_token');
    var id = this.state.location_id;
    console.log("Token:"+token+"Location Id:" + id);
    if (token !== null && id!==null) {
      return fetch(
        'http://10.0.2.2:3333/api/1.0.0/location/' + id + '/favourite',
        {
          method: 'DELETE',
          headers: {'X-Authorization': token},
        },
      )
        .then((res) => {
          if (res.status == 200){
            console.log('Favourite Location Request success');
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

  toggleFavourite=()=>{
    console.log("Toggle Favourite")
    if(this.state.isFavourite==true){
      this.favouriteLocation();
      this.setState({
        isFavourite:false
      });
    }else{
      this.unfavouriteLocation();
      this.setState({
        isFavourite:true
      });
    }
  }

  toggleReviews=()=>{
    console.log("Toggle Reviews")
    if(this.state.showReviews!=true){
      this.setState({showReviews:true});
    }else{
      this.setState({showReviews:false});
    }
  }
   
//   <Text>{item.review_body}</Text>
  render() {
    return (
      <ScrollView style={styles.body}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>{this.state.location_name}</Text>
        </View>
        <View style={[styles.item]}>
          <Image style={styles.image} source={this.state.local_path}/>
          <Text>{this.state.location_path}</Text>
          <TouchableOpacity
              style={styles.button}
              onPress={() => this.toggleFavourite()}>
                {
                  this.state.isFavourite?
                  (<Text style={styles.buttonText}> Add Favourite </Text>):
                  (<Text style={styles.buttonText}> Remove Favourite </Text>)
                }
          </TouchableOpacity>
        </View>
        <View style={[{flex:1,flexDirection:'row',justifyContent:'center'}]}>
          <Text style={[styles.subtitle,{marginRight:5}]}>Reviews</Text>
          <Switch
          onValueChange={()=>this.toggleReviews()}
          value={this.state.showReviews}
          />
        </View>
        { this.state.showReviews?
          (<View style={styles.item}>
              <FlatList
                data={this.state.location_reviews}
                renderItem={({item}) => (
                  <View style={[styles.review]}>
                    <Text>Overall: {item.overall_rating}/5</Text>
                    <Text>Price: {item.price_rating}/5</Text>
                    <Text>Quality: {item.quality_rating}/5 </Text>
                    <Text>Cleanliness:{item.clenliness_rating}/5</Text>
                    <Text>{item.review_body}</Text>
                    <TouchableOpacity style={styles.button}
                      onPress={() => this.deleteReview(item.review_id)}>
                      <Text style={styles.buttonText}> Delete Review </Text>
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(item) => item.review_id.toString()}
              />
          </View>) : null
        }
        <View style={styles.item}>
            <View >  
              <Text style={[styles.subtitle,{marginRight:5}]}>Add Review</Text>
            </View>
            <View >
            <View style={styles.reviewInput}>
              <Text>Price:</Text>
              <TextInput style={styles.textInput} placeholder="Enter Rating between 0-5" 
              onChangeText={(add_price) => this.setState({add_price})}
              value={this.state.add_price}/>
            </View>
            <View style={styles.reviewInput}>
              <Text>Quality:</Text>
              <TextInput style={styles.textInput}  placeholder="Enter Rating between 0-5" 
              onChangeText={(add_quality) => this.setState({add_quality})}
              value={this.state.add_quality}/>
            </View>
            <View style={styles.reviewInput}> 
              <Text>Cleanliness:</Text>
              <TextInput style={styles.textInput}  placeholder="Enter Rating between 0-5" 
              onChangeText={(add_clean) => this.setState({add_clean})}
              value={this.state.add_clean}/>
            </View>  
            <View style={styles.reviewInput}> 
              <Text>Overall:</Text>
              <TextInput style={styles.textInput}  placeholder="0-5" 
              onChangeText={(add_overall) => this.setState({add_overall})}
              value={this.state.add_overall}/>
            </View>  
            </View>
            <View>
              <TextInput style={styles.reviewTextbody} placeholder="Enter review text.."
              onChangeText={(add_reviewText) => this.setState({add_reviewText})}
              value={this.state.add_reviewText}/>
            </View>
            <View>
              <TouchableOpacity style={styles.button}
                onPress={() => this.addNewReview()}>
                <Text style={styles.buttonText}> Submit </Text>
              </TouchableOpacity>
            </View>
        </View>
      </ScrollView>
    );
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
  review:{
   flex:1,
   justifyContent:'center',
   alignItems:'center',
   backgroundColor: '#E0E0E0',
   borderRadius: 1,
   margin: 1.5,
  },
  reviewInput: {
    flex: 0.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
  },
  textInput: {
    borderWidth: 1,
    margin: 10,
    padding: 10,
  },
  reviewTextbody:{
    borderWidth: 0.2,
    margin: 5,
    padding: 15,
  },
  item: {
    backgroundColor: 'white',
    borderRadius: 5,
    margin: 2,
  },
  itemreview:{
    backgroundColor: '#F8F8F8',
    borderRadius: 1,
    margin: 1,
  },
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
    fontSize: 20,
  },
  subtitle:{
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 17,
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
  }
});

export default LocationItem;
