import React from 'react';
import {
  View,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import SelectUserType from 'screens/SelectUserType';
import SignUp from 'screens/SignUp';
import SignIn from 'screens/SignIn';

import { commonStyles } from 'themes/commonStyles';
import colors from 'themes/colors';


const AuthStack = createStackNavigator();

function AuthScreens() {
  return (
    <View style={commonStyles.navigator}>
      <AuthStack.Navigator
        headerMode="none"
        initialRouteName="SelectUserType"
        screenOptions={{
          backgroundColor: colors.main,
          cardStyle: {
            backgroundColor: colors.main,
          },
        }}
      >
        <AuthStack.Screen name="SelectUserType" component={SelectUserType} />
        <AuthStack.Screen name="SignUp" component={SignUp} />
        <AuthStack.Screen name="SignIn" component={SignIn} />
      </AuthStack.Navigator>
    </View>
  );
}

export default AuthScreens;
