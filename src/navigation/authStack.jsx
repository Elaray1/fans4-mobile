import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';


import SelectUserType from 'screens/SelectUserType';
import SignUp from 'screens/SignUp';
import SignIn from 'screens/SignIn';

import colors from 'themes/colors';


const AuthStack = createStackNavigator();

function AuthScreens() {
  return (
    <AuthStack.Navigator
      headerMode="none"
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
  );
}

export default AuthScreens;
