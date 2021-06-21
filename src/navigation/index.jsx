import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { InteractionManager } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen';
import { ToastProvider } from 'react-native-fast-toast';
import cookies from '@react-native-cookies/cookies';
import 'react-native-gesture-handler';

import { STORAGE_KEYS, PUSH_NOTIFICATION_TYPES } from 'helpers/constants';
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

const init = async (dispatch) => {
  // This is needed because react-native use cookies by default
  // but actually we don't use cookies
  // so we clear cookies in order to prevent mixing authorization cookies
  // with other authorization methods
  try {
    cookies.clearAll();
  } catch (err) {
    console.log('Clearing cookies error:', err);
  }

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


  if (rootNavigation.isInitialRoute()) {
    const { stack, screen } = getInitialScreen(user);
    rootNavigation.reset({ routes: [{ name: stack, params: { screen } }] });
  }


  // this is needed to hide splash screen after screen appearing animation
  InteractionManager.runAfterInteractions(() => SplashScreen.hide());
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
    switch (message.data.type) {
      case PUSH_NOTIFICATION_TYPES.POST_STATUS_CHANGED: {
        rootNavigation.navigate('Account');
        break;
      }
      default:
        break;
    }
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

const linking = {
  prefixes: [
    'fans4://',
  ],
  config: {
    screens: {
      AppStack: {
        screens: {
          Finances: 'finances/:stripeAccountId',
        },
      },
    },
  },
};

function AppNavigation() {
  const dispatch = useDispatch();
  const userAuthenticated = useSelector(userSelectors.getAuthenticated);
  const onNavigatorReady = useCallback(() => init(dispatch), [dispatch]);

  useEffect(() => {
    connectPushNotifications(userAuthenticated);
    return () => disconnectPushNotifications(userAuthenticated);
  }, [userAuthenticated]);

  return (
    <ToastProvider placement="top" offset={30}>
      <NavigationContainer
        theme={NAVIGATOR_CONTAINER_THEME}
        ref={rootNavigation.navigationRef}
        onReady={onNavigatorReady}
        linking={linking}
      >
        <Stack.Navigator initialRouteName={userAuthenticated ? 'AppStack' : 'AuthStack'} headerMode="none">
          <Stack.Screen name="AppStack" component={AppScreens} />
          <Stack.Screen name="AuthStack" component={AuthScreens} />
        </Stack.Navigator>
      </NavigationContainer>
    </ToastProvider>

  );
}

export default AppNavigation;
