import React from 'react';
import { SafeAreaView, View, StatusBar } from 'react-native';

import colors from 'themes/colors';
import Text from 'components/Text';

import styles from './Fights.styles';

function Fights() {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />
      <View style={styles.content}>
        <Text>Fights</Text>
      </View>
    </SafeAreaView>
  );
}

export default Fights;
