import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';

import { STORAGE_KEYS } from 'helpers/constants';
import { getItem } from 'helpers/storage';
import { navigationRef } from 'helpers/rootNavigation';

import * as userSelectors from 'resources/user/user.selectors';
import * as userActions from 'resources/user/user.actions';

import config from 'resources/config';

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
        dispatch(userActions.setUserAuthenticated());
      }
    })();
  }, [dispatch]);

  return (
    <NavigationContainer
      ref={navigationRef}
    >
      {userAuthenticated ? <AppScreens /> : <AuthScreens />}
      {/* {userAuthenticated ? <AuthScreens /> : <AppScreens />} */}
    </NavigationContainer>
  );
}

export default AppNavigation;
