import React, { useCallback, useState } from 'react';
import {
  SafeAreaView, View, ScrollView, StatusBar,
} from 'react-native';

import colors from 'themes/colors';

import SettingsModal from 'components/SettingsModal';
import Header from 'components/Header';
import Text from 'components/Text';

import styles from './Account.styles';

function Account() {
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const onBurgerPress = useCallback(() => {
    setIsSettingsVisible(true);
  }, []);

  const onSettingsClose = useCallback(() => {
    setIsSettingsVisible(false);
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />
      <SettingsModal
        visible={isSettingsVisible}
        onClose={onSettingsClose}
      />
      <Header
        title="Account"
        rightItemType="menu"
        onRightItemPress={onBurgerPress}
      />
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View>
          <Text>Account</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default React.memo(Account);
