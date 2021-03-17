import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';

import 'react-native-gesture-handler';
import {ScrollView, TextInput} from 'react-native-gesture-handler';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
    };
  }

  createUser = async () => {
    console.log('Sign up: method called');
    let obj = {
      first_name: this.state.firstname,
      last_name: this.state.lastname,
      email: this.state.email,
      password: this.state.password,
    };
    return fetch('http://10.0.2.2:3333/api/1.0.0/user', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(obj),
    })
      .then((res) => {
        if (res.status === 201) {
          console.log('Created New User Profile');
          return res.json();
        } else if (res.status === 400) {
          console.log('Invalid Sign Up Details');
          throw 'Invalid Sign Up Details';
        } else {
          console.log('Something is wrong somewhere..');
          throw 'Something is wrong somewhere';
        }
      })
      .then(async (res) => {
        console.log('Data:' + res);

        if (res !== undefined) {
          console.log(res.id);
          ToastAndroid.show('Created New User Profile', ToastAndroid.SHORT);
          this.props.navigation.navigate('SignIn');
        }
      })
      .catch((err) => {
        console.log('The error:' + err);
        ToastAndroid.show(err, ToastAndroid.SHORT);
      });
  };

  render() {
    return (
      <ScrollView>
        <View style={styles.viewContainer}>
          <View style={styles.viewInput}>
            <Text>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your first name"
              onChangeText={(firstname) => this.setState({firstname})}
              value={this.state.firstname}
            />
          </View>
          <View style={styles.viewInput}>
            <Text>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your last name"
              onChangeText={(lastname) => this.setState({lastname})}
              value={this.state.lastname}
            />
          </View>
          <View style={styles.viewInput}>
            <Text>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              onChangeText={(email) => this.setState({email})}
              value={this.state.email}
            />
          </View>
          <View style={styles.viewInput}>
            <Text>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              secureTextEntry={true}
              onChangeText={(password) => this.setState({password})}
              value={this.state.password}
            />
          </View>
          <View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.createUser()}>
              <Text style={styles.buttonText}> Submit </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
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

export default SignUp;
