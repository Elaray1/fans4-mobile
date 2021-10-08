import React, { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useTranslation } from 'react-i18next';

import PlusIcon from 'assets/icons/big-plus';

import Text from 'components/Text';
import SubscriptionPosibilities from 'components/SubscriptionPosibilities';

import styles from './styles';

const NoSubscriptions = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const goToFighters = useCallback(() => {
    navigation.navigate('SearchFighters');
  }, [navigation]);

  return (
    <>
      <Text style={styles.title}>
        {t('AccountFan.YourSubscriptions')}
      </Text>
      <Text style={styles.subtitle}>
        {t('AccountFan.youWillEnjoy')}
      </Text>

      <SubscriptionPosibilities />

      <TouchableOpacity onPress={goToFighters} style={styles.chooseFightersContainer}>
        <PlusIcon />
        <Text style={styles.chooseFightersText}>{t('AccountFan.chooseFighters')}</Text>
      </TouchableOpacity>
    </>
  );
};

export default React.memo(NoSubscriptions);
