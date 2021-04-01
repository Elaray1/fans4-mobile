import React from 'react';
import { View, ActivityIndicator } from 'react-native';

import styles from './splashScreen.styles';

function SplashScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator />
    </View>
  );
}

export default SplashScreen;
