import React, { useEffect } from 'react';
import { View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import config from 'resources/config';

import * as userActions from 'resources/user/user.actions';

import * as socketService from 'services/socket.service';

import { getMaskedDeviceId } from 'helpers/deviceInfo';
import { STORAGE_KEYS } from 'helpers/constants';
import { getItem, setItem, removeItem } from 'helpers/storage';

function AuthAppLoader() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    const bootstrap = async () => {
      SplashScreen.hide();
      const storedAccessToken = await getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (storedAccessToken) {
        return;
      }
      const fetchedAccessToken = await userActions.fetchAccessToken();
      if (fetchedAccessToken) {
        config.accessToken = fetchedAccessToken;
        await Promise.all([
          setItem(STORAGE_KEYS.ACCESS_TOKEN, fetchedAccessToken),
          userActions.removeVerificationDeviceId(),
          removeItem(STORAGE_KEYS.PREV_SCREEN),
          removeItem(STORAGE_KEYS.USER_TYPE),
          removeItem(STORAGE_KEYS.USER_EMAIL),
        ]);
        dispatch(userActions.setUserAuthenticated());
      } else {
        const [
          PREV_SCREEN,
          USER_TYPE,
          USER_EMAIL,
        ] = await Promise.all([
          getItem(STORAGE_KEYS.PREV_SCREEN),
          getItem(STORAGE_KEYS.USER_TYPE),
          getItem(STORAGE_KEYS.USER_EMAIL),
        ]);

        if (PREV_SCREEN) {
          switch (PREV_SCREEN) {
            case 'EmailConfirmation':
              navigation.reset({
                index: 2,
                routes: [
                  {
                    name: 'SelectUserType',
                  },
                  {
                    name: 'SignUp',
                    params: {
                      userType: USER_TYPE,
                    },
                  },
                  {
                    name: 'EmailConfirmation',
                    params: {
                      email: USER_EMAIL,
                      userType: USER_TYPE,
                      isResendEmail: true,
                    },
                  },
                ],
              });
              break;

            default:
              break;
          }
        } else {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'SelectUserType',
              },
            ],
          });
        }
      }

      if (socketService.disconnected()) {
        socketService.connect();
      }
      socketService.emit('subscribe', `device-${getMaskedDeviceId()}`);

      socketService.on('email:verified', async (accessToken) => {
        await Promise.all([
          setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken),
          removeItem(STORAGE_KEYS.PREV_SCREEN),
          removeItem(STORAGE_KEYS.USER_TYPE),
          removeItem(STORAGE_KEYS.USER_EMAIL),
        ]);
        config.accessToken = accessToken;
        await userActions.removeVerificationDeviceId();
        dispatch(userActions.setUserAuthenticated());
      });
    };

    bootstrap();
  }, [dispatch, navigation]);

  return (
    // TODO: add backgrount image / loader
    <View />
  );
}

export default AuthAppLoader;
