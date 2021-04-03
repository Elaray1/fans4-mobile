import React from 'react';
import { SafeAreaView, View, StatusBar } from 'react-native';

import colors from 'themes/colors';

import Text from 'components/Text';

import styles from './AppLoader.styles';

function AppLoader() {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.main} />
      <View style={styles.content}>
        <Text>App Loader</Text>
      </View>
    </SafeAreaView>
  );
}

export default AppLoader;
