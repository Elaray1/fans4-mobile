import React from 'react';
import {
  SafeAreaView, ScrollView, StatusBar, View,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import colors from 'themes/colors';

import Text from 'components/Text';
import Header from 'components/Header';

import styles from './styles';

function SettingsTermsOfUse() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />
      <Header leftItemType="backArrow" title={t('TermsOfUse.headerTitle')} />
      <View style={styles.content}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>{t('TermsOfUse.firstParagraphTitle')}</Text>
          <Text style={styles.text}>{t('TermsOfUse.firstParagraphText')}</Text>
          <Text style={styles.title}>{t('TermsOfUse.secondParagraphTitle')}</Text>
          <Text style={styles.text}>{t('TermsOfUse.secondParagraphText')}</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default React.memo(SettingsTermsOfUse);
