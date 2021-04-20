import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';

import config from 'resources/config';
import { setItem } from 'helpers/storage';
import { STORAGE_KEYS } from 'helpers/constants';

import SelectUserType from 'screens/SelectUserType';
import SignUp from 'screens/SignUp';
import SignIn from 'screens/SignIn';
import ForgotPassword from 'screens/ForgotPassword';
import ResetPasswordLink from 'screens/ResetPasswordLink';
import PasswordUpdated from 'screens/PasswordUpdated';

import * as socketService from 'services/socket.service';
import * as RootNavigation from 'helpers/rootNavigation';

import colors from 'themes/colors';

import { SET_USER_DATA } from 'resources/user/user.constants';


const AuthStack = createStackNavigator();

function AuthScreens() {
  const dispatch = useDispatch();

  useEffect(() => {
    const init = async () => {
      socketService.on('email:password-reset', async ({ accessToken, user }) => {
        config.accessToken = accessToken;
        await Promise.all([
          setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken),
          dispatch({ type: SET_USER_DATA, user }),
        ]);
        RootNavigation.reset({
          index: 0,
          routes: [{
            name: 'AppStack',
            state: {
              routes: [{ name: 'ChangePassword' }],
            },
          }],
        });
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
      <AuthStack.Screen name="PasswordUpdated" component={PasswordUpdated} />
    </AuthStack.Navigator>
  );
}

export default AuthScreens;
