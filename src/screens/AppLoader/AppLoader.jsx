import React, { useEffect } from 'react';
import { SafeAreaView, View, StatusBar } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import colors from 'themes/colors';

import Text from 'components/Text';

import styles from './AppLoader.styles';

function AppLoader() {
  useEffect(() => {
    return () => SplashScreen.hide();
  });

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />
      <View style={styles.content}>
        <Text>App Loader</Text>
      </View>
    </SafeAreaView>
  );
}

export default AppLoader;
