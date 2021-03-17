import React, {useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';

import 'react-native-gesture-handler';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useForm } from "react-hook-form";

function SignIn(props) {

  const navigation=useNavigation();
  const { register, handleSubmit, watch, errors,setValue } = useForm({
    defaultValues:{  email:"16047933@stu.mmu.ac.uk",password:"hello123" }
  })

  const {email,password}=watch();

  useEffect(()=>{
      register('email',{required:true,pattern:{value:/^\S+@\S+$/i, message: "invalid email address"}})
      register('password',{required:true})

  },[register]);

  getUser =  () => {
    console.log('Sign In:method called');
    console.log("Data:"+email+" "+password);
    let obj = {
      email: email,
      password: password,
    };
    return fetch('http://10.0.2.2:3333/api/1.0.0/user/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(obj),
    })
      .then((res) => {
        if (res.status === 200) {
          console.log('Sign in success');
          return res.json();
        } else if (res.status === 404) {
          console.log('Invalid email/password');
          navigation.navigate('SignIn');
          throw 'Invalid email/password';
        } else {
          throw 'Something is wrong somewhere';
        }
      })
      .then(async(res) => {
        console.log('Id:' + res.id);
        console.log('Token:' + res.token);

        await AsyncStorage.setItem('@session_token', res.token);
        await AsyncStorage.setItem('@user_id', JSON.stringify(res.id));
        ToastAndroid.show('Sign In Success!', ToastAndroid.SHORT);

        navigation.navigate('Home');
      })
      .catch((err) => {
        console.log('The error:' + err);
        ToastAndroid.show(err, ToastAndroid.SHORT);
      });
  };

  goSignup = () => {
    navigation.navigate('SignUp');
  };

  
  onSubmit=()=>{
    getUser();
  }
    return (
      <ScrollView>
        <View style={styles.viewContainer}>
          <View style={styles.viewInput}>
            <Text>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              onChangeText={(email)=>setValue('email',email,true)}
              value={email}
            />
           </View> 
           <View style={styles.viewInput}>
            <Text>Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry={true}
              placeholder="Enter your password"
              onChangeText={(password) => setValue('password',password,true)}
              value={password}
            />
            </View>
            <View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSubmit(onSubmit())}>
              <Text style={styles.buttonText}> Enter </Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text>Don't have an account?</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => goSignup()}>
              <Text style={styles.buttonText}> Sign Up </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
}

const styles = StyleSheet.create({
  viewContainer:{
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
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

//export default SignIn;
/*function SigninFunction(props){
  const navigation=useNavigation();
  const form=useForm();
  return <SignIn form={form} navigation={navigation}/>;

}*/

export default SignIn;

