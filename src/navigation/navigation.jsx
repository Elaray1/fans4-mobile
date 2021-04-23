import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen';
import 'react-native-gesture-handler';

import { STORAGE_KEYS } from 'helpers/constants';
import { getItem } from 'helpers/storage';
import { getMaskedDeviceId } from 'helpers/deviceInfo';
import getInitialScreen from 'helpers/getInitialScreen';
import * as rootNavigation from 'helpers/rootNavigation';

import * as userSelectors from 'resources/user/user.selectors';
import * as userActions from 'resources/user/user.actions';
import config from 'resources/config';

import * as sockets from 'services/socket.service';
import firebasePushNotificationService from 'services/firebase.pushNotification.service';
import localPushNotificationService from 'services/local.pushNotification.service';

import colors from 'themes/colors';

import AppScreens from './appStack';
import AuthScreens from './authStack';

const NAVIGATOR_CONTAINER_THEME = {
  colors: {
    background: colors.main,
  },
};

const Stack = createStackNavigator();

const init = async (dispatch, setIsInitialized) => {
  let user;
  const accessToken = await getItem(STORAGE_KEYS.ACCESS_TOKEN);

  if (accessToken) {
    config.accessToken = accessToken;

    try {
      user = await dispatch(userActions.getUserData());
      sockets.connect();
      sockets.emit('subscribe', `user-${user._id}`);
    } catch (err) {
      console.log('Fetching user on start error:', err.message);
    }
  }

  if (!user) {
    sockets.connect();
    sockets.emit('subscribe', `device-${getMaskedDeviceId()}`);
  }

  const { stack, screen } = getInitialScreen(user);
  rootNavigation.reset({ routes: [{ name: stack, params: { screen } }] });
  setIsInitialized(true);
};

const connectPushNotifications = (userAuthenticated) => {
  if (!userAuthenticated) {
    return;
  }

  const onRegister = async (pushNotificationToken) => {
    await userActions.setPushToken(pushNotificationToken);
  };

  const onNotification = (message) => {
    console.log('[App] onNotification: ', message);

    const options = {
      soundName: 'default',
      playSound: true,
    };

    if (message.notification) {
      localPushNotificationService.showNotification(
        Number(Math.random().toString().substr(2, 9)),
        message.notification.title,
        message.notification.body,
        message.data,
        options,
      );
    }
  };

  const onOpenNotification = async (message) => {
    console.log('[App] onOpenNotification: ', message);
  };

  (async () => {
    await firebasePushNotificationService.registerAppWithFCM();
    await firebasePushNotificationService.register(onRegister, onNotification, onOpenNotification);
    localPushNotificationService.configure(onOpenNotification);
  })();
};

const disconnectPushNotifications = (userAuthenticated) => {
  if (!userAuthenticated) {
    return;
  }

  firebasePushNotificationService.unregister();
  localPushNotificationService.unregister();
};

function AppNavigation() {
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  const userAuthenticated = useSelector(userSelectors.getAuthenticated);

  const onNavigatorReady = useCallback(() => {
    init(dispatch, setIsInitialized);
  }, [dispatch, setIsInitialized]);

  useEffect(() => {
    if (isInitialized) {
      SplashScreen.hide();
    }
  }, [isInitialized]);

  useEffect(() => {
    connectPushNotifications(userAuthenticated);
    return () => disconnectPushNotifications(userAuthenticated);
  }, [userAuthenticated]);

  return (
    <NavigationContainer
      ref={rootNavigation.navigationRef}
      theme={NAVIGATOR_CONTAINER_THEME}
      onReady={onNavigatorReady}
    >
      <Stack.Navigator initialRouteName={userAuthenticated ? 'AppStack' : 'AuthStack'} headerMode="none">
        <Stack.Screen name="AppStack" component={AppScreens} />
        <Stack.Screen name="AuthStack" component={AuthScreens} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigation;
