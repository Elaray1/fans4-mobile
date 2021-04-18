import React from 'react';
import {
  View,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import AuthAppLoader from 'screens/AuthAppLoader';
import SelectUserType from 'screens/SelectUserType';
import SignUp from 'screens/SignUp';
import EmailConfirmation from 'screens/EmailConfirmation';
import SignIn from 'screens/SignIn';

import colors from 'themes/colors';


const AuthStack = createStackNavigator();

function AuthScreens() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.main }}>
      <AuthStack.Navigator
        headerMode="none"
        initialRouteName="AuthAppLoader"
        screenOptions={{
          backgroundColor: colors.main,
          cardStyle: {
            backgroundColor: colors.main,
          },
        }}
      >
        <AuthStack.Screen name="AuthAppLoader" component={AuthAppLoader} />
        <AuthStack.Screen name="SelectUserType" component={SelectUserType} />
        <AuthStack.Screen name="SignUp" component={SignUp} />
        <AuthStack.Screen name="EmailConfirmation" component={EmailConfirmation} />
        <AuthStack.Screen name="SignIn" component={SignIn} />
      </AuthStack.Navigator>
    </View>
  );
}

export default AuthScreens;
