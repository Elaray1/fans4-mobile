import React, { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { InteractionManager, AppState } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen';
import { ToastProvider } from 'react-native-fast-toast';
import cookies from '@react-native-cookies/cookies';

import 'react-native-gesture-handler';

import { STORAGE_KEYS } from 'helpers/constants';
import { getItem } from 'helpers/storage';
import { getMaskedDeviceId } from 'helpers/deviceInfo';
import getInitialScreen from 'helpers/getInitialScreen';
import * as rootNavigation from 'helpers/rootNavigation';

import analyticsService from 'services/analytics.service';
import websocketsService from 'services/socket.service';

import * as userActions from 'resources/user/user.actions';
import * as userApi from 'resources/user/user.api';
import * as userSelectors from 'resources/user/user.selectors';

import config from 'resources/config';
import store from 'store';

import colors from 'themes/colors';

import OfflineBanner from 'components/OfflineBanner';

import AppScreens from './appStack';
import AuthScreens from './authStack';

import useInAppPurchases from './hooks/useInAppPurchases';
import useIsUserBlocked from './hooks/useIsUserBlocked';
import useNotifications from './hooks/useNotifications';
import useWebsockets from './hooks/useWebsockets';
import useLaunchAnalyticsEvent from './hooks/useLaunchAnalyticsEvent';

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
    await cookies.clearAll();
  } catch (err) {
    console.log('Clearing cookies error:', err);
  }

  let user;
  const accessToken = await getItem(STORAGE_KEYS.ACCESS_TOKEN);

  if (accessToken) {
    config.accessToken = accessToken;

    try {
      user = await userApi.getUserData();

      websocketsService.connect({
        query: { accessToken },
        rooms: [`user-${user._id}`],
      });


      dispatch(userActions.setUserData(user));
    } catch (err) {
      console.log('Fetching user on start error:', err.message);
    }
  }

  if (!user) {
    websocketsService.connect({
      query: { deviceId: getMaskedDeviceId() },
      rooms: [`device-${getMaskedDeviceId()}`],
    });
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

AppState.addEventListener('change', async (appState) => {
  if (appState === 'active') {
    try {
      await store.dispatch(userActions.getUserData());
    } catch (err) {
      console.error('Failed updating user after app went to foreground', err);
    }
  }
});

function AppNavigation() {
  useInAppPurchases();
  useIsUserBlocked();
  useNotifications();
  useWebsockets();
  useLaunchAnalyticsEvent();

  const dispatch = useDispatch();
  const userAuthenticated = useSelector(userSelectors.getAuthenticated);

  const routeNameRef = useRef();

  const onNavigatorReady = useCallback(async () => {
    routeNameRef.current = rootNavigation.navigationRef.current.getCurrentRoute().name;
    await init(dispatch);
  }, [dispatch]);

  const userType = useSelector(userSelectors.getUserType);

  const trackScreensOpening = useCallback(() => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = rootNavigation.navigationRef.current.getCurrentRoute().name;

    if (previousRouteName !== currentRouteName) {
      analyticsService.logEvent({
        name: analyticsService.events.SCREEN_OPENED,
        data: {
          userType,
        },
      });
    }

    routeNameRef.current = currentRouteName;
  }, [userType]);

  return (
    <ToastProvider placement="top" offset={30}>
      <NavigationContainer
        theme={NAVIGATOR_CONTAINER_THEME}
        ref={rootNavigation.navigationRef}
        onReady={onNavigatorReady}
        linking={linking}
        onStateChange={trackScreensOpening}
      >
        <OfflineBanner />

        <Stack.Navigator initialRouteName={userAuthenticated ? 'AppStack' : 'AuthStack'} headerMode="none">
          <Stack.Screen name="AppStack" component={AppScreens} />
          <Stack.Screen name="AuthStack" component={AuthScreens} />
        </Stack.Navigator>
      </NavigationContainer>
    </ToastProvider>
  );
}

export default AppNavigation;
