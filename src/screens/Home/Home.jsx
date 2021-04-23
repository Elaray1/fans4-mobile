import React, { useEffect } from 'react';
import { SafeAreaView, View, StatusBar } from 'react-native';

import colors from 'themes/colors';
import Text from 'components/Text';
import { clear } from 'helpers/storage';

import styles from './Home.styles';

function Home() {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />
      <View style={styles.content}>
        <Text>Home</Text>
      </View>
    </SafeAreaView>
  );
}

export default Home;
