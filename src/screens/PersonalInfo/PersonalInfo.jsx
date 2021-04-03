import React from 'react';
import { SafeAreaView, View, StatusBar } from 'react-native';

import colors from 'themes/colors';

import Text from 'components/Text';

import styles from './PersonalInfo.styles';

function PersonalInfo() {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.main} />
      <View style={styles.content}>
        <Text>Personal Info</Text>
      </View>
    </SafeAreaView>
  );
}

export default PersonalInfo;
