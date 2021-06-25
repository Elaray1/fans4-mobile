import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';
import 'moment-duration-format';
import moment from 'moment';

import * as userSelectors from 'resources/user/user.selectors';
import { USER_TYPES } from 'resources/user/user.constants';

import Text from 'components/Text';
import Fighter from 'components/Fight/Fighter';
import Button from 'components/Button';

import { toLocalDateAndTime, toLocalDate } from 'helpers/toLocalTime';

import { FIGHT_VIEW_TYPE } from 'components/Fight/constants';

import styles from './styles';

const formatDuration = seconds => moment.duration(seconds, 'seconds').format('mm:ss');

const getLocation = location => `${location.cityName}, ${location.stateCode}`;

function Fight({
  fight,
  status,
}) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const userId = useSelector(userSelectors.getUserId);
  const userType = useSelector(userSelectors.getUserType);

  const onFighterPress = useCallback((fighterId) => {
    if (userId === fighterId) {
      navigation.navigate('Account');
    } else {
      navigation.navigate('Fighter', { _id: fighterId });
    }
  }, [navigation, userId]);

  const [firstFighter, secondFighter] = fight.fighters;

  let fightResultText;
  if (fight.results) {
    const durationFormatted = formatDuration(fight.results.duration);
    const winMethodFormatted = _.startCase(fight.results.winMethod);
    fightResultText = `${fight.results.roundNumber}, ${durationFormatted}, ${winMethodFormatted}`;
  }

  const FIGHT_INFO = {
    [FIGHT_VIEW_TYPE.EVENT_UPCOMING]: () => (
      <View style={styles.location}>
        <Text style={styles.text}>{getLocation(firstFighter.hometown)}</Text>
        <Text style={styles.text}>{getLocation(secondFighter.hometown)}</Text>
      </View>
    ),
    [FIGHT_VIEW_TYPE.EVENT_PAST]: () => (
      <View>
        <Text style={styles.text}>
          {t('Fight.round')}
          {' '}
          {fightResultText}
        </Text>
      </View>
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
            {!fight.votedUserIds.includes(userId)
              ? (
                <View style={styles.fanVoted}>
                  <Text style={styles.fanVotedText}>
                    {t('Fight.you')} {!fight.suggestions.fans?.some(f => f._id === userId)
                    && t('Fight.createdAnd')}{t('Fight.voted')} ({fight.votedUserIds.length})
                  </Text>
                </View>
              )
              : <Button title={t('Fight.vote')} onPress={() => {}} style={styles.button} />}
          </View>
        )}
      </>
    ),
    [FIGHT_VIEW_TYPE.UPCOMING]: () => (
      <View>
        <Text style={styles.text}>
          {`${fight.event.name} / ${getLocation(fight.event.location)}`}
        </Text>
        <Text style={styles.text}>
          {toLocalDateAndTime(fight.event)}
        </Text>
      </View>
    ),
    [FIGHT_VIEW_TYPE.PAST]: () => (
      <View>
        <Text style={styles.text}>
          {`${fight.event.name} / ${toLocalDate(fight.event)}`}
        </Text>
        <Text style={styles.text}>
          {t('Fight.round')}
          {' '}
          {fightResultText}
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
};

Fight.defaultProps = {
  status: null,
};

export default React.memo(Fight);
