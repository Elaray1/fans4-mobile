import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import AuthAppLoader from 'screens/AuthAppLoader';
import colors from 'themes/colors';


const AuthStack = createStackNavigator();

function AuthScreens() {
  return (
    <AuthStack.Navigator
      headerMode="none"
      initialRouteName="AuthAppLoader"
      screenOptions={{
        cardStyle: {
          backgroundColor: colors.main,
        },
      }}
    >
      <AuthStack.Screen name="AuthAppLoader" component={AuthAppLoader} />
    </AuthStack.Navigator>
  );
}

export default AuthScreens;
