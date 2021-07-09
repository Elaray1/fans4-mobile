import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';
import 'moment-duration-format';
import moment from 'moment';

import * as userSelectors from 'resources/user/user.selectors';
import { USER_TYPES } from 'resources/user/user.constants';
import * as fightApi from 'resources/fight/fight.api';

import Text from 'components/Text';
import Fighter from 'components/Fight/Fighter';
import Button from 'components/Button';

import { toLocalDateAndTime, toLocalDate } from 'helpers/toLocalTime';

import useToast from 'hooks/useToast';

import { FIGHT_VIEW_TYPE, FIGHT_RESULT_LABELS } from 'components/Fight/constants';

import styles from './styles';

const formatDuration = seconds => moment.duration(seconds, 'seconds').format('mm:ss');

const getLocation = location => `${location.cityName}, ${location.stateCode}`;

function Fight({
  fight,
  status,
  onVote,
}) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { showFailure } = useToast();

  const userId = useSelector(userSelectors.getUserId);
  const userType = useSelector(userSelectors.getUserType);
  const userSubscriptions = useSelector(userSelectors.getSubscribedFighters);

  const onFighterPress = useCallback((fighterId) => {
    if (userId === fighterId) {
      navigation.navigate('Account');
    } else {
      navigation.navigate('Fighter', { _id: fighterId });
    }
  }, [navigation, userId]);

  const [firstFighter, secondFighter] = fight.fighters;

  const onPressVote = useCallback(async (fightId, fighters) => {
    if (userSubscriptions.includes(fighters[0]._id || fighters[1]._id)) {
      try {
        if (!fight.votedUserIds.includes(userId)) {
          await fightApi.vote({ fightId });
        } else {
          await fightApi.unvote({ fightId });
        }
        onVote(fightId, userId);
      } catch {
        showFailure();
      }
    } else {
      Alert.alert(
        t('Fight.subscription'),
        t('Fight.youHaveToBeSubscribed'),
        [
          { text: t('Fight.ok') },
        ],
      );
    }
  }, [fight.votedUserIds, onVote, showFailure, t, userId, userSubscriptions]);

  const FIGHT_INFO = {
    [FIGHT_VIEW_TYPE.EVENT_UPCOMING]: () => (
      <View style={styles.location}>
        <Text style={styles.text}>{getLocation(firstFighter.hometown)}</Text>
        <Text style={styles.text}>{getLocation(secondFighter.hometown)}</Text>
      </View>
    ),
    [FIGHT_VIEW_TYPE.EVENT_PAST]: () => (
      <>
        {fight.results ? (
          <View style={styles.pastContainer}>
            <View style={styles.dateContainer}>
              <Text style={styles.text}>
                {fight.event.name} / {toLocalDate(fight.event)}
              </Text>
            </View>
            <View style={styles.resultContainer}>
              <View style={styles.textContainer}>
                <Text style={styles.resultsText}>{FIGHT_RESULT_LABELS[fight.results.winMethodCategory]}</Text>
                <Text style={styles.text}>{t('Fight.round')} {fight.results.roundNumber}</Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.text}>{_.startCase(fight.results.winMethod)}</Text>
                <Text style={styles.text}>{formatDuration(fight.results.duration)}</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.location}>
            <Text style={styles.text}>{getLocation(firstFighter.hometown)}</Text>
            <Text style={styles.text}>{getLocation(secondFighter.hometown)}</Text>
          </View>
        )
    }
      </>
    ),
    [FIGHT_VIEW_TYPE.IN_VOTING]: () => (
      <>
        { userType === USER_TYPES.FIGHTER ? (
          <View style={styles.location}>
            <Text style={styles.text}>{getLocation(firstFighter.hometown)}</Text>
            <View style={styles.votes}>
              <Text style={styles.votesText}>{`${fight.votedUserIds.length} ${t('Fight.votes')}`}</Text>
            </View>
            <Text style={styles.text}>{getLocation(secondFighter.hometown)}</Text>
          </View>
        ) : (
          <View style={styles.location}>
            {fight.votedUserIds.includes(userId)
              ? (
                <TouchableOpacity
                  style={styles.fanVoted}
                  onPress={() => onPressVote(fight._id, fight.fighters)}
                >
                  <Text style={styles.fanVotedText}>
                    {t('Fight.you')} {fight.suggestions.fans?.some(f => f._id === userId)
                    && t('Fight.createdAnd')}{t('Fight.voted')} ({fight.votedUserIds.length})
                  </Text>
                </TouchableOpacity>
              )
              : (
                <Button
                  title={t('Fight.vote')}
                  onPress={() => onPressVote(fight._id, fight.fighters)}
                  style={styles.button}
                />
              )}
          </View>
        )}
      </>
    ),
    [FIGHT_VIEW_TYPE.VOTING_CLOSED]: () => (
      <View
        style={styles.fanVoted}
      >
        <Text style={styles.fanVotedText}>
          {t('Fight.votingClosed')} ({fight.votedUserIds.length})
        </Text>
      </View>

    ),
    [FIGHT_VIEW_TYPE.UPCOMING]: () => (
      <>
        {userType === USER_TYPES.FIGHTER ? (
          <View>
            <Text style={styles.text}>
              {`${fight.event.name} / ${getLocation(fight.event.location)}`}
            </Text>
            <Text style={styles.text}>
              {toLocalDateAndTime(fight.event)}
            </Text>
          </View>
        ) : (
          <View
            style={styles.upcoming}
          >
            <Text style={styles.upcomingText}>
              {t('Fight.upcoming')}
            </Text>
          </View>
        )}
      </>
    ),
    [FIGHT_VIEW_TYPE.DECLINED]: () => (
      <View
        style={styles.declined}
      >
        <Text style={styles.declinedText}>
          {t('Fight.declined')}
        </Text>
      </View>
    ),
    [FIGHT_VIEW_TYPE.PENDING]: () => (
      <View
        style={styles.pending}
      >
        <Text style={styles.pendingText}>
          {t('Fight.pending')}
        </Text>
      </View>
    ),
  };

  return (
    <View style={styles.fight} key={fight._id}>
      <View style={styles.fightersInfo}>
        <View style={styles.fighters}>
          <Fighter
            fighter={firstFighter}
            isWinner={firstFighter._id === fight.results?.winnerId}
            style={styles.firstFighter}
            onPress={onFighterPress}
          />
          <Text style={[styles.captionText, styles.vs]}>
            {t('Fight.vs')}
          </Text>
          <Fighter
            fighter={secondFighter}
            isWinner={secondFighter._id === fight.results?.winnerId}
            onPress={onFighterPress}
          />
        </View>
        <View style={styles.line} />
        {FIGHT_INFO[status || fight.status]()}
      </View>
    </View>
  );
}

Fight.propTypes = {
  fight: PropTypes.shape().isRequired,
  status: PropTypes.oneOf(Object.values(FIGHT_VIEW_TYPE)),
  onVote: PropTypes.func,
};

Fight.defaultProps = {
  status: null,
  onVote: null,
};

export default React.memo(Fight);
