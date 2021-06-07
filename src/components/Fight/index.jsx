import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

import * as userSelectors from 'resources/user/user.selectors';

import Text from 'components/Text';
import Fighter from 'components/Fight/Fighter';

import { toLocalDateAndTime, toLocalDate } from 'helpers/toLocalTime';

import { EVENT_FIGHT_STATUSES, FIGHT_STATUSES } from 'resources/fight/fight.constants';

import styles from './styles';

const formatDuration = seconds => moment(moment.duration(seconds, 's').asMilliseconds()).format('mm:ss');

const getLocation = location => `${location.cityName}, ${location.stateCode}`;

function Fight({
  fight,
  status,
}) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const userId = useSelector(userSelectors.getUserId);

  const onFighterPress = useCallback((fighterId) => {
    if (userId === fighterId) {
      navigation.navigate('Account');
    } else {
      navigation.navigate('Fighter', { _id: fighterId });
    }
  }, [navigation, userId]);

  const [firstFighter, secondFighter] = fight.fighters;

  const FIGHT_INFO = {
    [EVENT_FIGHT_STATUSES.UPCOMING]: () => (
      <View style={styles.location}>
        <Text style={styles.text}>{getLocation(firstFighter.hometown)}</Text>
        <Text style={styles.text}>{getLocation(secondFighter.hometown)}</Text>
      </View>
    ),
    [EVENT_FIGHT_STATUSES.PAST]: () => (
      <View>
        <Text style={styles.text}>
          {t('Fight.round')}
          {' '}
          {`${fight.results.roundNumber}, ${formatDuration(fight.results.duration)}, ${fight.results.winMethod}`}
        </Text>
      </View>
    ),
    [FIGHT_STATUSES.IN_VOTING]: () => (
      <View style={styles.location}>
        <Text style={styles.text}>{getLocation(firstFighter.hometown)}</Text>
        <View style={styles.votes}>
          <Text style={styles.votesText}>{`${fight.votedUserIds.length} ${t('Fight.votes')}`}</Text>
        </View>
        <Text style={styles.text}>{getLocation(secondFighter.hometown)}</Text>
      </View>
    ),
    [FIGHT_STATUSES.UPCOMING]: () => (
      <View>
        <Text style={styles.text}>
          {`${fight.event.name} / ${getLocation(fight.event.location)}`}
        </Text>
        <Text style={styles.text}>
          {toLocalDateAndTime(fight.event)}
        </Text>
      </View>
    ),
    [FIGHT_STATUSES.PAST]: () => (
      <View>
        <Text style={styles.text}>
          {`${fight.event.name} / ${toLocalDate(fight.event)}`}
        </Text>
        <Text style={styles.text}>
          {t('Fight.round')}
          {' '}
          {`${fight.results.roundNumber}, ${formatDuration(fight.results.duration)}, ${fight.results.winMethod}`}
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
  status: PropTypes.oneOf([...Object.values(EVENT_FIGHT_STATUSES), ...Object.values(FIGHT_STATUSES)]),
};

Fight.defaultProps = {
  status: null,
};

export default React.memo(Fight);
