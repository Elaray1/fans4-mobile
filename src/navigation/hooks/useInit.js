import { useCallback } from 'react';
import { Linking, InteractionManager } from 'react-native';
import cookies from '@react-native-cookies/cookies';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import SplashScreen from 'react-native-splash-screen';

import { getItem } from 'helpers/storage';
import { STORAGE_KEYS } from 'helpers/constants';
import { getMaskedDeviceId } from 'helpers/deviceInfo';
import getInitialScreen from 'helpers/getInitialScreen';
import * as rootNavigation from 'helpers/rootNavigation';

import config from 'resources/config';
import * as userApi from 'resources/user/user.api';
import * as userActions from 'resources/user/user.actions';
import websocketsService from 'services/socket.service';

import useToast from 'hooks/useToast';

import handleDeeplink from '../helpers/handleDeeplink';

const clearCookies = async () => {
  try {
    await cookies.clearAll();
  } catch (err) {
    console.log('Clearing cookies error:', err);
  }
};

const useInit = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { showFailure } = useToast();

  const login = useCallback(async () => {
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

    return user;
  }, [dispatch]);

  const navigateToInitialScreen = useCallback(async (user) => {
    const initialUrl = await Linking.getInitialURL();

    let isNavigatedToStartScreen = true;

    if (initialUrl) {
      isNavigatedToStartScreen = handleDeeplink({
        url: initialUrl,
        showFailure,
        userId: user?._id,
        t,
      });
    }

    if ((!initialUrl && rootNavigation.isInitialRoute()) || !isNavigatedToStartScreen) {
      const { stack, screen } = getInitialScreen(user);
      rootNavigation.reset({ routes: [{ name: stack, params: { screen } }] });
    }
  }, [showFailure, t]);

  const init = useCallback(async () => {
    // This is needed because react-native use cookies by default
    // but actually we don't use cookies(we use local storage + authorization header to login user)
    // so we clear cookies in order to prevent mixing authorization cookies with other authorization methods
    await clearCookies();

    const user = await login();
    await navigateToInitialScreen(user);

    // this is needed to hide splash screen after screen appearing animation
    InteractionManager.runAfterInteractions(() => SplashScreen.hide());
  }, [login, navigateToInitialScreen]);

  return init;
};

export default useInit;
