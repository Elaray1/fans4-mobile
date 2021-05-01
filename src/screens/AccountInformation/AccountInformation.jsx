import React, { useCallback } from 'react';
import {
  SafeAreaView, ScrollView, View, TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import ArrowRightIcon from 'assets/icons/arrow-right';

import * as userSelectors from 'resources/user/user.selectors';

import Header from 'components/Header';
import Text from 'components/Text';

import styles from './AccountInformation.styles';

function AccountInformation() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const userEmail = useSelector(userSelectors.getUserEmail);
  const userNewEmail = useSelector(userSelectors.getUserNewEmail);

  const onChangeBiography = useCallback(() => {
    navigation.navigate('ChangeBiography');
  }, [navigation]);

  const onChangeEmail = useCallback(() => {
    navigation.navigate('ChangeEmail');
  }, [navigation]);

  return (
    <SafeAreaView style={styles.screen}>
      <Header
        title={t('AccountInformation.accountInformation')}
        leftItemType="backArrow"
      />
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View>
          <TouchableOpacity
            style={styles.item}
            onPress={onChangeEmail}
          >
            <View style={styles.itemContent}>
              <Text style={styles.itemText}>{t('AccountInformation.email')}</Text>
              <View style={styles.itemContent}>
                <View style={styles.itemContent}>
                  <Text style={[styles.email, userNewEmail && styles.newEmail]}>
                    {userEmail}
                  </Text>
                  {userNewEmail && (
                  <View style={styles.emailPending}>
                    <Text style={styles.emailPendingText}>Pending</Text>
                  </View>
                  )}
                </View>
                <ArrowRightIcon style={styles.arrowRight} />
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.line} />
        </View>
        <View>
          <TouchableOpacity
            style={styles.item}
            onPress={onChangeBiography}
          >
            <View style={styles.itemContent}>
              <Text style={styles.itemText}>{t('AccountInformation.biography')}</Text>
              <ArrowRightIcon />
            </View>
          </TouchableOpacity>
          <View style={styles.line} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default AccountInformation;
