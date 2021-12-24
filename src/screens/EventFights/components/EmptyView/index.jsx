import React, { useCallback } from 'react';
import { ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import * as userSelectors from 'resources/user/user.selectors';

import Text from 'components/Text';
import Button from 'components/Button';

import PlusIcon from 'assets/icons/grey-plus';

import styles from './styles';

const EmptyView = ({ isFan, isRefreshing, onRefresh }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const userSubscriptions = useSelector(userSelectors.getSupportedFighters);

  const navigateToFightersList = useCallback(() => {
    navigation.navigate('Tabs', {
      screen: 'Fighters',
    });
  }, [navigation]);

  const navigateToPropose = useCallback(() => {
    if (userSubscriptions.length) {
      navigation.navigate('ProposeAFight');
    } else {
      Alert.alert(
        t('Voting.subscription'),
        t('Voting.youHaveToBeSubscribed'),
        [
          { text: t('Voting.ok') },
        ],
      );
    }
  }, [navigation, t, userSubscriptions?.length]);

  const content = isFan ? (
    <>
      <Text style={styles.noFightsText}>
        {t('EventFights.wantToSeeYourFighterInUpcomingEvents')}
      </Text>
      <TouchableOpacity style={styles.button} onPress={navigateToPropose}>
        <PlusIcon />
        <Text style={styles.buttonText}>{t('EventFights.propose')}</Text>
      </TouchableOpacity>
    </>
  ) : (
    <>
      <Text style={styles.noFightsText}>
        {t('EventFights.wantToFightInUpcomingEvents')}
      </Text>
      <Button title={t('EventFights.chooseFighter')} onPress={navigateToFightersList} />
    </>
  );

  return (
    <ScrollView
      contentContainerStyle={styles.noFightsContainer}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.noFightsTitle}>{t('EventFights.stayedTunedForFightCard')}</Text>
      {content}
    </ScrollView>
  );
};

EmptyView.propTypes = {
  isFan: PropTypes.bool.isRequired,
  isRefreshing: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
};


export default React.memo(EmptyView);
