import React, { useCallback } from 'react';
import {
  SafeAreaView, ScrollView, View, TouchableOpacity, Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import ArrowRightIcon from 'assets/icons/arrow-right';

import Header from 'components/Header';
import Text from 'components/Text';

import * as userSelectors from 'resources/user/user.selectors';
import { USER_TYPES } from 'resources/user/user.constants';

import styles from './styles';

function LegalInformation() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const userType = useSelector(userSelectors.getUserType);

  const onTermsOfUse = useCallback(() => {
    navigation.navigate('SettingsTermsOfUse');
  }, [navigation]);

  const onPrivacypolicy = useCallback(() => {
    navigation.navigate('SettingsPrivacyPolicy');
  }, [navigation]);

  const onSubscriptionInformation = useCallback(() => {
    navigation.navigate('SettingsSubscriptionInformation');
  }, [navigation]);

  return (
    <SafeAreaView style={styles.screen}>
      <Header
        title={t('LegalInformation.legalInformation')}
        leftItemType="backArrow"
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
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

        {userType === USER_TYPES.FAN && Platform.OS === 'ios' && (
          <View>
            <TouchableOpacity
              style={styles.item}
              onPress={onSubscriptionInformation}
            >
              <View style={styles.itemContent}>
                <Text style={styles.itemText}>{t('LegalInformation.subscriptionInformation')}</Text>
                <ArrowRightIcon />
              </View>
            </TouchableOpacity>
            <View style={styles.line} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default LegalInformation;
