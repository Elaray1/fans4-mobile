import React, { useEffect } from 'react';
import { SafeAreaView, View, StatusBar } from 'react-native';
// import { useDispatch } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';

import colors from 'themes/colors';

import Text from 'components/Text';

// import config from 'resources/config';
// import * as userActions from 'resources/user/user.actions';

// import { getMaskedDeviceId } from 'helpers/deviceInfo';
// import { STORAGE_KEYS } from 'helpers/constants';
// import { getItem, setItem } from 'helpers/storage';

import styles from './AuthAppLoader.styles';

function AuthAppLoader() {
  // const dispatch = useDispatch();

  useEffect(() => {
    async function init() {
      // checker for case when email was verified when app had been closed
      // const storedAccessToken = await getItem(STORAGE_KEYS.ACCESS_TOKEN);
      // if (storedAccessToken) {
      //   return;
      // }
      // const accessToken = await userActions.fetchAccessToken({ userType });
      // if (accessToken) {
      //   config.accessToken = accessToken;
      //   await setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      //   dispatch(userActions.setUserAuthenticated());
      // }
      SplashScreen.hide();
    }

    init();
  }, []);

  useEffect(() => {
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.main} />
      <View style={styles.content}>
        <Text>Auth App</Text>
      </View>
    </SafeAreaView>
  );
}

export default AuthAppLoader;
