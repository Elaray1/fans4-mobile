import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import 'react-native-gesture-handler';

import colors from 'themes/colors';

import * as userSelectors from 'resources/user/user.selectors';
import * as rootNavigation from 'helpers/rootNavigation';

import OfflineBanner from 'components/OfflineBanner';

import AppScreens from './appStack';
import AuthScreens from './authStack';

import useInit from './hooks/useInit';
import useInAppPurchases from './hooks/useInAppPurchases';
import useIsUserBlocked from './hooks/useIsUserBlocked';
import useNotifications from './hooks/useNotifications';
import useWebsockets from './hooks/useWebsockets';
import useUpdateUser from './hooks/useUpdateUser';
import useWasOpenedBefore from './hooks/useWasOpenedBefore';
import useTrackScreens from './hooks/useTrackScreens';
import useDeepLink from './hooks/useDeepLink';

const NAVIGATOR_CONTAINER_THEME = {
  colors: {
    background: colors.main,
  },
};

const Stack = createStackNavigator();

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
  const init = useInit();
  const { trackScreens, routeNameRef } = useTrackScreens();

  useInAppPurchases();
  useIsUserBlocked();
  useNotifications();
  useWebsockets();
  useUpdateUser();
  useWasOpenedBefore();
  useDeepLink();

  const userAuthenticated = useSelector(userSelectors.getAuthenticated);

  const onNavigatorReady = useCallback(async () => {
    routeNameRef.current = rootNavigation.navigationRef.current.getCurrentRoute().name;
    await init();
  }, [routeNameRef, init]);

  return (
    <NavigationContainer
      theme={NAVIGATOR_CONTAINER_THEME}
      ref={rootNavigation.navigationRef}
      onReady={onNavigatorReady}
      onStateChange={trackScreens}
      linking={linking}
    >
      <OfflineBanner />

      <Stack.Navigator initialRouteName={userAuthenticated ? 'AppStack' : 'AuthStack'} headerMode="none">
        <Stack.Screen name="AppStack" component={AppScreens} />
        <Stack.Screen name="AuthStack" component={AuthScreens} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigation;
