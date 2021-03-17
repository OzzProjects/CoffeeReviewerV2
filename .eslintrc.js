/* Rules handling:
 0 => "off" - The following rule is off
 1 => "warn" - Displays a warning message
 2 => "error" - Display an error message

 Though most rules are already incorporated within
 the react native community.
*/
 //extends: '@react-native-community',
  //extends:["eslint:recommended","plugin:react-native/recommended"]

module.exports = {
  root: true,
  "plugins": [
    "react",
    "react-native"
  ],
  "parserOptions": {
    "ecmaFeatures": {
        "jsx": true
    }
  },
  "env": {
    "react-native/react-native": true
  },
  "extends":'airbnb',
  "rules": {
    "react/no-did-mount-set-state": 2,
    "react/no-direct-mutation-state": 2,
    "react/jsx-uses-vars": 2,
    "semi": 2,
    "react/prop-types": 2,
    "react/jsx-no-bind": 2,
    "react/jsx-no-duplicate-props": 2,
  },
};
