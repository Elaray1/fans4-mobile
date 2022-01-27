import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import Header from 'components/Header';
import Text from 'components/Text';

import styles from './styles';

const SettingsSubscriptionInformation = () => {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.screen}>
      <Header
        title={t('SubscriptionInformation.title')}
        leftItemType="backArrow"
      />

      <View style={styles.content}>
        <Text style={styles.text}>
          {t('SubscriptionInformation.description1')}
        </Text>

        <Text style={styles.text}>
          {t('SubscriptionInformation.description2')}
        </Text>

        <Text style={styles.text}>
          {t('SubscriptionInformation.description3')}
        </Text>

        <Text style={styles.text}>
          {t('SubscriptionInformation.description4')}
        </Text>
      </View>

    </SafeAreaView>
  );
};

export default React.memo(SettingsSubscriptionInformation);
