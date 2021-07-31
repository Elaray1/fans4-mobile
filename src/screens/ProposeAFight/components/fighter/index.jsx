import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';

import RadioButtonIcon from 'assets/icons/radio-button';
import RadioButtonSelectedIcon from 'assets/icons/radio-button-selected';

import Text from 'components/Text';
import StatusBadge from 'components/StatusBadge';

import { USER_STATUSES, FIGHTING_STATUSES } from 'resources/user/user.constants';

import styles from './styles';

const Fighter = ({
  fighter,
  isSelected,
  setFighter,
  firstFighterWeightClasses,
}) => {
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

  const isDisabled = Boolean(reason);

  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selected]}
      onPress={() => setFighter(fighter)}
      disabled={isDisabled}
    >
      <FastImage
        style={[styles.image, isDisabled && styles.tintGray]}
        source={{ uri: fighter.avatarUrl }}
      />

      { isDisabled && (
        <FastImage
          style={[styles.image, isDisabled && styles.grayImage]}
          source={{ uri: fighter.avatarUrl }}
        />
      )}

      <View style={[styles.textContainer, isDisabled && styles.disabledTextContainer]}>
        <Text style={[styles.name, isDisabled && styles.opacity]}>
          {fighter.fullName}
        </Text>

        {fighter?.role?.biography?.nickname && (
          <Text style={[styles.nickname, isDisabled && styles.opacity]}>
            {`"${fighter?.role?.biography?.nickname}"`}
          </Text>
        )}

        <Text style={[styles.location, isDisabled && styles.opacity]}>
          {fighter?.role?.biography?.hometown?.cityName}, {fighter?.role?.biography?.hometown?.stateCode}
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
