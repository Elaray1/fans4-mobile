import React, { useCallback } from 'react';
import {
  SafeAreaView, ScrollView, StatusBar, View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import colors from 'themes/colors';

import Text from 'components/Text';
import Header from 'components/Header';
import Button from 'components/Button';

import styles from './TermsOfUse.styles';

function TermsOfUse() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const onAccept = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'VerificationPending' }],
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />
      <Header leftItemType="backArrow" title={t('TermsOfUse.headerTitle')} />
      <View style={styles.content}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>{t('TermsOfUse.firstParagraphTitle')}</Text>
          <Text style={styles.text}>{t('TermsOfUse.firstParagraphText')}</Text>
          <Text style={styles.title}>{t('TermsOfUse.secondParagraphTitle')}</Text>
          <Text style={styles.text}>{t('TermsOfUse.secondParagraphText')}</Text>
        </ScrollView>
        <Button
          title={t('TermsOfUse.buttonText')}
          onPress={onAccept}
          buttonStyles={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

export default React.memo(TermsOfUse);
