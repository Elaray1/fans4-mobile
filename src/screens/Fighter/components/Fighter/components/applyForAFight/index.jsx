import React, { useCallback, useState } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';

import useToast from 'hooks/useToast';

import Button from 'components/Button';

import SuccessToastIcon from 'assets/icons/successToast.svg';

import { FIGHTING_STATUSES, FIGHTER_WEIGHT_CATEGORIES } from 'resources/user/user.constants';
import * as userSelectors from 'resources/user/user.selectors';
import { FIGHT_STATUSES } from 'resources/fight/fight.constants';
import * as fightApi from 'resources/fight/fight.api';

import styles from './styles';

const ApplyForAFight = ({ fighter, fight: initFight }) => {
  const { t } = useTranslation();
  const { showSuccess: showSuccessToast, showFailure: showFailureToast } = useToast();

  const userId = useSelector(userSelectors.getUserId);
  const userWeightClasses = useSelector(userSelectors.getWeightClasses);
  const userFightingStatus = useSelector(userSelectors.getFightingStatus);

  const [loading, setLoading] = useState(false);
  const [fight, setFight] = useState(initFight);

  const createFight = useCallback(async () => {
    setLoading(true);

    try {
      const createdFight = await fightApi.create({ fighterIds: [userId, fighter._id] });
      setFight(createdFight);

      showSuccessToast(t('Fighter.youAppliedForAFight'));
    } catch (err) {
      console.error('Apply for a fight error:', err);
      showFailureToast(t('Fighter.unableToApplyForAFight'));
    }

    setLoading(false);
  }, [userId, fighter._id, showSuccessToast, showFailureToast, t]);

  const areBothFightersReadyForFight = fighter.role.fightingStatus === FIGHTING_STATUSES.READY_FOR_FIGHTS
    && userFightingStatus === FIGHTING_STATUSES.READY_FOR_FIGHTS;

  const isSharedWeightClasses = _.intersection(fighter.role.profile.weightClasses, userWeightClasses).length > 0;
  const isCreatedByCurrentFighter = fight?.suggestions?.fighters?.find(f => f._id === userId && f.isCreator);
  const isFightInAdminReview = fight && fight.status && _.includes([
    FIGHT_STATUSES.PENDING,
    FIGHT_STATUSES.VOTING_CLOSED,
    FIGHT_STATUSES.APPROVED,
  ], fight.status);

  if (!fight && isSharedWeightClasses && areBothFightersReadyForFight) {
    return (
      <Button
        isLoading={loading}
        disabled={loading}
        onPress={createFight}
        title={t('Fighter.applyForAFight')}
        style={styles.applyButton}
      />
    );
  }

  if (userFightingStatus !== FIGHTING_STATUSES.READY_FOR_FIGHTS) {
    return (
      <Text style={styles.cannotApplyForAFightText}>
        {`${t('Fighter.youInjured_0')}${fighter.fullName}${t('Fighter.youInjured_1')}`}
      </Text>
    );
  }

  if (fighter.role.fightingStatus !== FIGHTING_STATUSES.READY_FOR_FIGHTS) {
    return (
      <Text style={styles.cannotApplyForAFightText}>
        {`${t('Fighter.fighterInjured_0')}${fighter.fullName}${t('Fighter.fighterInjured_1')}`}
      </Text>
    );
  }

  if (!isSharedWeightClasses) {
    const warningTitleStart = t('Fighter.youCannotApplyForAFight_0');
    const wargningTitleEnd = t('Fighter.youCannotApplyForAFight_1');

    return (
      <Text style={styles.cannotApplyForAFightText}>
        {`${warningTitleStart}${fighter.fullName}${wargningTitleEnd}`}
      </Text>
    );
  }

  if (isCreatedByCurrentFighter && fight?.status === FIGHT_STATUSES.PENDING) {
    return (
      <View style={styles.createdFightContainer}>
        <View style={styles.createdFightTextWrapper}>
          <SuccessToastIcon />
          <Text style={styles.createdFightText}>{t('Fighter.youApplied')}</Text>
        </View>
      </View>
    );
  }

  if (isFightInAdminReview) {
    return (
      <View style={styles.createdFightContainer}>
        <View style={styles.createdFightTextWrapper}>
          <SuccessToastIcon />
          <Text style={styles.createdFightText}>{t('Fighter.yourFightIsInAdminReview')}</Text>
        </View>
      </View>
    );
  }

  if (fight.status === FIGHT_STATUSES.IN_VOTING) {
    return (
      <View style={styles.createdFightContainer}>
        <View style={styles.createdFightTextWrapper}>
          <SuccessToastIcon />
          <Text style={styles.createdFightText}>{t('Fighter.yourFightIsAlreadyInVoting')}</Text>
        </View>
      </View>
    );
  }

  if (fight.status === FIGHT_STATUSES.UPCOMING) {
    return (
      <View style={styles.createdFightContainer}>
        <View style={styles.createdFightTextWrapper}>
          <SuccessToastIcon />
          <Text style={styles.createdFightText}>{t('Fighter.yourFightIsAlreadyInUpcomingEvent')}</Text>
        </View>
      </View>
    );
  }
};

ApplyForAFight.propTypes = {
  fight: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.oneOf([...Object.values(FIGHT_STATUSES)]).isRequired,
    suggestions: PropTypes.shape({
      fighters: PropTypes.arrayOf(
        PropTypes.shape({

          _id: PropTypes.string.isRequired,
          isCreator: PropTypes.bool,
        }),
      ),
    }),
  }),
  fighter: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    role: PropTypes.shape({
      fightingStatus: Object.values(FIGHTING_STATUSES),
      profile: PropTypes.shape({
        weightClasses: PropTypes.arrayOf(
          PropTypes.oneOf(Object.values(FIGHTER_WEIGHT_CATEGORIES)),
        ),
      }),
    }).isRequired,
    fullName: PropTypes.string.isRequired,
  }).isRequired,
};

export default React.memo(ApplyForAFight);
