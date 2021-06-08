import React from 'react';
import { SafeAreaView, View, StatusBar } from 'react-native';

import colors from 'themes/colors';

import Text from 'components/Text';

import styles from './Fighters.styles';

function Fighters() {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />
      <View style={styles.content}>
        <Text>Fighters</Text>
      </View>
    </SafeAreaView>
  );
}

export default React.memo(Fighters);
