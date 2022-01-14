import React from 'react';
import { View, ActivityIndicator } from 'react-native';

import colors from 'themes/colors';

import styles from './styles';

const FullScreenLoader = () => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    </View>
  );
};

export default React.memo(FullScreenLoader);
