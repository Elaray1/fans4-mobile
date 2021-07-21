import React from 'react';
import {
  SafeAreaView, ScrollView, StatusBar, View,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import { useSelector } from 'react-redux';

import colors from 'themes/colors';

import Text from 'components/Text';
import Header from 'components/Header';

import * as userSelectors from 'resources/user/user.selectors';

import styles from './styles';

function SettingsPrivacyPolicy() {
  const { t } = useTranslation();

  const userType = useSelector(userSelectors.getUserType);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />
      <Header leftItemType="backArrow" title={t('SettingsPrivacyPolicy.privacyPolicy')} />
      <View style={styles.content}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>{t(`SettingsPrivacyPolicy.${userType}.agreementToTerms`)}</Text>
          <Text style={styles.text}>{t(`SettingsPrivacyPolicy.${userType}.terms`)}</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default React.memo(SettingsPrivacyPolicy);
