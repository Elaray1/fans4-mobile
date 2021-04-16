import React from 'react';
import {
  SafeAreaView, ScrollView, StatusBar, View,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import colors from 'themes/colors';

import Text from 'components/Text';
import Header from 'components/Header';
import Button from 'components/Button';

import styles from './TermsOfUse.styles';

function TermsOfUse() {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />
      <View  style={styles.content}>
      <Header isBackArrow title={t('TermsOfUse.headerTitle')} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{t('TermsOfUse.firstParagraphTitle')}</Text>
        <Text style={styles.text}>{t('TermsOfUse.firstParagraphText')}</Text>
        <Text style={styles.title}>{t('TermsOfUse.secondParagraphTitle')}</Text>
        <Text style={styles.text}>{t('TermsOfUse.secondParagraphText')}</Text>
      </ScrollView>
      <Button
          title={t('TermsOfUse.buttonText')}
          onPress={() => {}}
          buttonStyles={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

export default TermsOfUse;
