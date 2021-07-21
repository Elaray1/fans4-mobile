import React, { useCallback } from 'react';
import {
  SafeAreaView, ScrollView, View, TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import ArrowRightIcon from 'assets/icons/arrow-right';

import Header from 'components/Header';
import Text from 'components/Text';

import styles from './styles';

function LegalInformation() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const onTermsOfUse = useCallback(() => {
    navigation.navigate('SettingsTermsOfUse');
  }, [navigation]);

  const onPrivacypolicy = useCallback(() => {
    navigation.navigate('SettingsPrivacyPolicy');
  }, [navigation]);

  return (
    <SafeAreaView style={styles.screen}>
      <Header
        title={t('LegalInformation.legalInformation')}
        leftItemType="backArrow"
      />
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View>
          <TouchableOpacity
            style={styles.item}
            onPress={onTermsOfUse}
          >
            <View style={styles.itemContent}>
              <Text style={styles.itemText}>{t('LegalInformation.termsOfUse')}</Text>
              <ArrowRightIcon />
            </View>
          </TouchableOpacity>
          <View style={styles.line} />
        </View>
        <View>
          <TouchableOpacity
            style={styles.item}
            onPress={onPrivacypolicy}
          >
            <View style={styles.itemContent}>
              <Text style={styles.itemText}>{t('LegalInformation.privacyPolicy')}</Text>
              <ArrowRightIcon />
            </View>
          </TouchableOpacity>
          <View style={styles.line} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

export default LegalInformation;
