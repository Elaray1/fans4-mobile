import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Platform, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';

import * as userSelectors from 'resources/user/user.selectors';

import RadioButtonIcon from 'assets/icons/radio-button';
import RadioButtonSelectedIcon from 'assets/icons/radio-button-selected';
import LockIcon from 'assets/icons/lock.svg';

import Text from 'components/Text';
import StatusBadge from 'components/StatusBadge';

import { USER_STATUSES, FIGHTING_STATUSES, FIGHTER_TYPES } from 'resources/user/user.constants';

import styles from './styles';

const Fighter = ({
  fighter,
  isSelected,
  setFighter,
  firstFighterWeightClasses,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const userSubscriptions = useSelector(userSelectors.getSupportedFighters);
  const isSubscribed = userSubscriptions.find(f => f._id === fighter._id);

  let reason = null;

  if (firstFighterWeightClasses
    && _.intersection(firstFighterWeightClasses, fighter.role.profile.weightClasses).length === 0) {
    reason = 'weightClasses';
  }

  if (fighter.role.fightingStatus === FIGHTING_STATUSES.INJURED
    || fighter.role.fightingStatus === FIGHTING_STATUSES.RECOVERY) {
    reason = 'fightingStatus';
  }

  if (fighter.status === USER_STATUSES.BLOCKED) {
    reason = 'status';
  }

  if (!isSubscribed) {
    reason = 'noSubscription';
  }

  const isDisabled = Boolean(reason);

  const record = fighter.role.fighterType === FIGHTER_TYPES.PRO
    ? fighter.role.profile.recordPro : fighter.role.profile.record;

  const selectFighter = useCallback(() => {
    if (!isSubscribed) {
      const alertOptions = [
        { text: t('BecomeFanAlert.ok') },
      ];

      if (Platform.OS === 'ios') {
        alertOptions.push({
          text: t('BecomeFanAlert.chooseFighter'),
          onPress: () => navigation.navigate('SearchFighters'),
        });
      }

      Alert.alert(
        t('BecomeFanVotingAlert.title'),
        t('BecomeFanVotingAlert.proposeFightDescription'),
        alertOptions,
      );

      return;
    }

    setFighter(fighter);
  }, [isSubscribed, fighter, setFighter, t, navigation]);

  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selected]}
      onPress={selectFighter}
      disabled={isDisabled && reason !== 'noSubscription'}
    >
      <View>
        <FastImage
          style={[styles.image, isDisabled && styles.grayImage]}
          source={{ uri: fighter.avatarUrl }}
        />
        {fighter.role.fighterType === FIGHTER_TYPES.PRO
        && (
          <View style={[styles.proLabel, isDisabled && styles.disabledProLabel]}>
            <Text style={styles.proLabelText}>P</Text>
          </View>
        )}
      </View>

      <View style={[styles.textContainer, isDisabled && styles.disabledTextContainer]}>
        <Text style={[styles.name, isDisabled && styles.opacity]}>
          {`${fighter.firstName} ${fighter.lastName}`}
        </Text>

        <Text style={[styles.location, isDisabled && styles.opacity]}>
          {fighter?.role?.biography?.hometown?.cityName}, {fighter?.role?.biography?.hometown?.stateCode}
        </Text>

        <Text style={[styles.name, isDisabled && styles.opacity]}>
          {record.wins ?? 0}-{record.losses ?? 0}-{record.draws ?? 0}
        </Text>

        {reason === 'status' && (
          <StatusBadge status={fighter.status} />
        )}

        {reason === 'fightingStatus' && (
          <View style={styles.fightingStatus}>
            <Text style={styles.fightingStatusText}>{fighter.role.fightingStatus}</Text>
          </View>
        )}

        {reason === 'weightClasses' && (
          <Text style={[styles.nickname, isDisabled && styles.opacity]}>Weight categories do not match</Text>
        )}
      </View>

      {!isDisabled && (
        <>
          {isSelected
            ? <RadioButtonSelectedIcon style={styles.radioButtonIcon} />
            : <RadioButtonIcon style={styles.radioButtonIcon} />
          }
        </>
      )}

      {reason === 'noSubscription' && <LockIcon />}
    </TouchableOpacity>
  );
};


Fighter.propTypes = {
  fighter: PropTypes.shape().isRequired,
  isSelected: PropTypes.bool.isRequired,
  setFighter: PropTypes.func.isRequired,
  firstFighterWeightClasses: PropTypes.arrayOf(PropTypes.string),
};

Fighter.defaultProps = {
  firstFighterWeightClasses: null,
};

export default React.memo(Fighter);
