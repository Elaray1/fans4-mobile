import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';

import { STORAGE_KEYS } from 'helpers/constants';
import { getItem, setItem } from 'helpers/storage';
import { navigationRef } from 'helpers/rootNavigation';

import * as userSelectors from 'resources/user/user.selectors';
import * as userActions from 'resources/user/user.actions';

import config from 'resources/config';

import colors from 'themes/colors';

import AuthScreens from './authStack';
import AppScreens from './appStack';

function AppNavigation() {
  const dispatch = useDispatch();
  const userAuthenticated = useSelector(userSelectors.getAuthenticated);

  useEffect(() => {
    (async () => {
      const accessToken = await getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (accessToken) {
        config.accessToken = accessToken;
        await dispatch(userActions.getUserData());
      } else {
        const fetchedAccessToken = await userActions.fetchAccessToken();
        if (fetchedAccessToken) {
          config.accessToken = fetchedAccessToken;
          await Promise.all([
            setItem(STORAGE_KEYS.ACCESS_TOKEN, fetchedAccessToken),
            userActions.removeVerificationDeviceId(),
          ]);
          await dispatch(userActions.getUserData());
        }
      }
      SplashScreen.hide();
    })();
  }, [dispatch]);

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={{ colors: { background: colors.main } }}
    >
      {userAuthenticated ? <AppScreens /> : <AuthScreens />}
    </NavigationContainer>
  );
}

export default AppNavigation;
