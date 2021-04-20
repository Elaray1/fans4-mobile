import React from 'react';
import {
  SafeAreaView, View, ScrollView, StatusBar,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import colors from 'themes/colors';

import Header from 'components/Header';
import Button from 'components/Button';


import styles from './PersonalInfo.styles';

function PersonalInfo() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Header isBackArrow title={t('PersonalInfo.PersonalInfo')} />
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
