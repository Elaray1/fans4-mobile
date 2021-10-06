import React, { useCallback, useMemo } from 'react';
import { Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import moment from 'moment';


import { useTranslation } from 'react-i18next';

import { FIGHTING_STATUSES, USER_STATUSES, SUBSCRIPTION_PLATFORMS } from 'resources/user/user.constants';
import * as userSelectors from 'resources/user/user.selectors';

import Text from 'components/Text';
import Button from 'components/Button';

import styles from './styles';

const ActionButtonsForFan = ({ fighter, subscribe, unsubscribe, resubscribe }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const goToProposeAFight = useCallback(() => {
    navigation.navigate('ProposeAFight', { preselectedFighterId: fighter._id });
  }, [navigation, fighter]);

  const userSubscriptions = useSelector(userSelectors.getSupportedFighters);
  const subscription = userSubscriptions.find(f => f._id === fighter._id);

  const isSubscribed = useMemo(() => {
    if (!subscription) {
      return false;
    }

    const isBeforeRenewalDate = moment(subscription.renewalDate).isAfter(moment());
    const isBeforeGracePeriodEndDate = moment(subscription.gracePeriodEndDate).isAfter(moment());

    return isBeforeRenewalDate || isBeforeGracePeriodEndDate;
  }, [subscription]);


  const isSubscribedButWillBeStopped = useMemo(() => {
    if (!subscription) {
      return false;
    }

    const isBeforeRenewalDate = moment(subscription.renewalDate).isAfter(moment());
    return isBeforeRenewalDate && !subscription.autorenewal;
  }, [subscription]);


  let firstActionButton = null;
  let secondActionButton = null;

  if (isSubscribed) {
    const firstActionButtonStyles = [
      styles.subscribedButton,
      (fighter.role.fightingStatus !== FIGHTING_STATUSES.READY_FOR_FIGHTS && fighter.status !== USER_STATUSES.BLOCKED)
        && styles.noMargin,
    ];

    const canResubcribeInApp = isSubscribedButWillBeStopped && Platform.OS === 'ios'
      && subscription.platform === SUBSCRIPTION_PLATFORMS.IOS;

    firstActionButton = (
      <Button
        onPress={canResubcribeInApp ? resubscribe : unsubscribe}
        title={canResubcribeInApp ? t('Fighter.resubscribe') : t('Fighter.subscribed')}
        type="done"
        style={firstActionButtonStyles}
      />
    );

    if (fighter.status === USER_STATUSES.BLOCKED) {
      secondActionButton = (
        <Text style={styles.blockedSupportedFighterText}>
          {t('Fighter.subscribeToAnotherWhenBlocked')}
        </Text>
      );
    } else if (fighter.role.fightingStatus === FIGHTING_STATUSES.READY_FOR_FIGHTS) {
      secondActionButton = (
        <Button
          title={t('Fighter.proposeAFight')}
          style={styles.applyButton}
          onPress={goToProposeAFight}
        />
      );
    }
  } else if (Platform.OS === 'ios' && fighter.status !== USER_STATUSES.BLOCKED) {
    firstActionButton = <Button title={t('Fighter.subscribe')} style={styles.applyButton} onPress={subscribe} />;
  }

  return (
    <>
      {firstActionButton}
      {secondActionButton}
    </>
  );
};

ActionButtonsForFan.propTypes = {
  unsubscribe: PropTypes.func.isRequired,
  subscribe: PropTypes.func.isRequired,
  resubscribe: PropTypes.func.isRequired,
  fighter: PropTypes.object.isRequired,
};


export default React.memo(ActionButtonsForFan);
