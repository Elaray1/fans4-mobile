import React, { useCallback } from 'react';
import {
  SafeAreaView, ScrollView, View, TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import ArrowRightIcon from 'assets/icons/arrow-right';

import Header from 'components/Header';
import Text from 'components/Text';

import styles from './AccountInformation.styles';

function AccountInformation() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const onChangeBiography = useCallback(() => {
    navigation.navigate('ChangeBiography');
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
            onPress={onChangeBiography}
          >
            <View style={styles.itemContent}>
              <Text style={styles.itemText}>{t('AccountInformation.biography')}</Text>
              <ArrowRightIcon />
            </View>
            <View style={styles.line} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default AccountInformation;
