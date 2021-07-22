import React, { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { InteractionManager } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen';
import { ToastProvider } from 'react-native-fast-toast';
import cookies from '@react-native-cookies/cookies';
import 'react-native-gesture-handler';

import { STORAGE_KEYS } from 'helpers/constants';
import { getItem, setItem } from 'helpers/storage';
import { getMaskedDeviceId } from 'helpers/deviceInfo';
import getInitialScreen from 'helpers/getInitialScreen';
import * as rootNavigation from 'helpers/rootNavigation';

import analyticsService from 'services/analytics.service';

import * as userSelectors from 'resources/user/user.selectors';
import * as userActions from 'resources/user/user.actions';
import config from 'resources/config';
import * as sockets from 'services/socket.service';
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
  const wasOpenedBefore = await getItem(STORAGE_KEYS.WAS_OPENED_BEFORE);
  if (!wasOpenedBefore) {
    analyticsService.logEvent({ name: analyticsService.events.FIRST_LAUNCH });
    await setItem(STORAGE_KEYS.WAS_OPENED_BEFORE, JSON.stringify(true)); // without JSON.stringify() it doesn't work
  } else {
    analyticsService.logEvent({ name: analyticsService.events.LAUNCH });
  }

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

  const routeNameRef = useRef();

  const onNavigatorReady = useCallback(async () => {
    routeNameRef.current = rootNavigation.navigationRef.current.getCurrentRoute().name;
    await init(dispatch);
  }, [dispatch]);

  const userId = useSelector(userSelectors.getUserId);
  const userType = useSelector(userSelectors.getUserType);

  const trackScreensOpening = useCallback(() => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = rootNavigation.navigationRef.current.getCurrentRoute().name;

    if (previousRouteName !== currentRouteName) {
      analyticsService.logEvent({
        name: analyticsService.events.SCREEN_OPENED,
        data: {
          userId,
          userType,
        },
      });
    }

    routeNameRef.current = currentRouteName;
  }, [userId, userType]);

  return (
    <ToastProvider placement="top" offset={30}>
      <NavigationContainer
        theme={NAVIGATOR_CONTAINER_THEME}
        ref={rootNavigation.navigationRef}
        onReady={onNavigatorReady}
        linking={linking}
        onStateChange={trackScreensOpening}
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
