import React from 'react';
import { SafeAreaView, Image, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import Illustration from 'assets/illustrations/new-voting.png'; // eslint-disable-line import/extensions

import Header from 'components/Header';
import Text from 'components/Text';

import styles from './styles';

const NewVoting = () => {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.screen}>
      <Header title={t('Voting.voting')} />
      <View style={styles.content}>
        <Text style={styles.bigText}>{t('Voting.comingSoon')}</Text>
        <Image source={Illustration} resizeMode="cover" style={styles.image} />
        <Text style={styles.text}>
          {t('Voting.soonWeWillRelease')}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default React.memo(NewVoting);
