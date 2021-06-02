import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';

import SelectUserType from 'screens/SelectUserType';
import SignUp from 'screens/SignUp';
import SignIn from 'screens/SignIn';
import ForgotPassword from 'screens/ForgotPassword';
import ResetPasswordLink from 'screens/ResetPasswordLink';
import PasswordReseted from 'screens/PasswordReseted';
import * as socketService from 'services/socket.service';
import * as rootNavigation from 'helpers/rootNavigation';

import colors from 'themes/colors';

const AuthStack = createStackNavigator();

function AuthScreens() {
  const dispatch = useDispatch();

  useEffect(() => {
    const init = async () => {
      socketService.on('email:password-reset', async ({ resetPasswordToken, userType }) => {
        rootNavigation.resetToScreen('AppStack', 'ChangePassword', { resetPasswordToken, userType });
      });
    };

    init();
  }, [dispatch]);
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
      <AuthStack.Screen name="ForgotPassword" component={ForgotPassword} />
      <AuthStack.Screen name="ResetPasswordLink" component={ResetPasswordLink} />
      <AuthStack.Screen name="PasswordReseted" component={PasswordReseted} />
    </AuthStack.Navigator>
  );
}

export default AuthScreens;
