import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import CheckmarkIcon from 'assets/icons/success.svg';

import Text from 'components/Text';

import styles from './styles';

const SubscriptionPosibilities = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.subscriptionPosibilities}>
      <View style={styles.subscriptionPosibilityContainer}>
        <CheckmarkIcon />
        <Text style={[styles.subscriptionPosibility, styles.subscriptionPosibilityMargin]}>
          {t('SubscriptionPosibilities.subscriptionPossibility1')}
        </Text>
      </View>

      <View style={styles.subscriptionPosibilityContainer}>
        <CheckmarkIcon />
        <Text style={[styles.subscriptionPosibility, styles.subscriptionPosibilityMargin]}>
          {t('SubscriptionPosibilities.subscriptionPossibility2')}
        </Text>
      </View>

      <View style={styles.subscriptionPosibilityContainer}>
        <CheckmarkIcon />

        <Text style={[styles.subscriptionPosibility, styles.subscriptionPosibilityMargin]}>
          {t('SubscriptionPosibilities.subscriptionPossibility3')}
        </Text>
      </View>

      <View style={styles.subscriptionPosibilityContainer}>
        <CheckmarkIcon />

        <Text style={styles.subscriptionPosibility}>
          {t('SubscriptionPosibilities.subscriptionPossibility4')}
        </Text>
      </View>
    </View>
  );
};

export default React.memo(SubscriptionPosibilities);
