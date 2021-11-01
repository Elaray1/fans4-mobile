import React from 'react';
import { ActivityIndicator, SafeAreaView, StatusBar, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { WebView } from 'react-native-webview';

import colors from 'themes/colors';

import Header from 'components/Header';

import styles from './styles';

const PRIVACY_POLICY_URL_SOURCE = { uri: 'https://www.fans4.com/privacy-policy' };

function SettingsPrivacyPolicy() {
  const { t } = useTranslation();

  const renderLoading = () => (
    <View style={styles.loadingView}>
      <ActivityIndicator size="large" />
    </View>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />

      <Header leftItemType="backArrow" title={t('SettingsPrivacyPolicy.privacyPolicy')} />

      <WebView
        source={PRIVACY_POLICY_URL_SOURCE}
        startInLoadingState
        renderLoading={renderLoading}
      />
    </SafeAreaView>
  );
}

export default React.memo(SettingsPrivacyPolicy);
