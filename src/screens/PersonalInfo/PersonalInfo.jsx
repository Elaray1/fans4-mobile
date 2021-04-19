import React from 'react';
import {
  SafeAreaView, View, ScrollView, StatusBar,
} from 'react-native';

import colors from 'themes/colors';

import Header from 'components/Header';

import Button from 'components/Button';


import styles from './PersonalInfo.styles';

function PersonalInfo() {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Header isBackArrow title="Personal Info" />
        <View />

        <Button
          title="Next"
          onPress={() => {}}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

export default PersonalInfo;
