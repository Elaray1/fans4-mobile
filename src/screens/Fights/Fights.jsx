import React from 'react';
import Header from 'components/Header';
import {
  SafeAreaView, View, StatusBar, ScrollView,
} from 'react-native';

import colors from 'themes/colors';
import Text from 'components/Text';

import styles from './Fights.styles';

function Fights() {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />
      <Header title="Fights" />
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Text>Fights</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

export default React.memo(Fights);
