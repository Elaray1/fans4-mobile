import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import AuthApp from 'screens/AuthApp';
import colors from 'themes/colors';


const AuthStack = createStackNavigator();

function AuthScreens() {
  return (
    <AuthStack.Navigator
      headerMode="none"
      initialRouteName="AuthApp"
      screenOptions={{
        cardStyle: {
          backgroundColor: colors.main,
        },
      }}
    >
      <AuthStack.Screen name="AuthApp" component={AuthApp} />
    </AuthStack.Navigator>
  );
}

export default AuthScreens;
