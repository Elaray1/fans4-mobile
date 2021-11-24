import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import 'moment-duration-format';

import * as userSelectors from 'resources/user/user.selectors';
import { USER_TYPES } from 'resources/user/user.constants';

import Text from 'components/Text';

import { toLocalDateAndTime } from 'helpers/toLocalTime';

import colors from 'themes/colors';

import CheckmarkIcon from 'assets/icons/check-mark-winner.svg';

import { FIGHT_VIEW_TYPE } from './constants';
import Fighter from './components/Fighter';
import PastFightInfo from './components/PastFightInfo';
import Countdown from './components/Countdown';


import styles from './styles';
import getLocation from './getLocation';

const FIGHT_TYPE_LABEL = {
  pro: 'Pro Fight',
  amateur: 'Amateur Fight',
};

const titleCase = (str) => {
  const splitStr = str.split(' ');
  return splitStr.map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
};

function FightItem({
  fight,
  viewType,
  inVotingMode,
  isCountdownShown,
}) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const userId = useSelector(userSelectors.getUserId);
  const userType = useSelector(userSelectors.getUserType);

  const [firstFighter, secondFighter] = fight.fighters;

  const firstFighterRecord = firstFighter.role.record;
  const secondFighterRecord = secondFighter.role.record;

  const onFighterPress = useCallback((fighterId) => {
    if (userId === fighterId) {
      navigation.navigate('Account');
    } else {
      navigation.navigate('Fighter', { _id: fighterId });
    }
  }, [navigation, userId]);

  const isResultsShown = (fight.votedNoUserIds.includes(userId) || fight.votedYesUserIds.includes(userId))
  || userType === USER_TYPES.FIGHTER;

  const fightResults = () => {
    const totalValue = fight.votedYesUserIds.length + fight.votedNoUserIds.length;
    const percentage = (count) => {
      return Math.round((100 * count) / totalValue);
    };
    return (
      <>
        {!!totalValue && (
          <View style={styles.votes}>
            <View style={styles.votesContainer}>
              <Text style={styles.votesText}>
                {percentage(fight.votedNoUserIds.length)}%
                - {t('Fight.no')}
              </Text>
              {fight.votedNoUserIds.includes(userId) && <CheckmarkIcon style={styles.checkMark} />}
            </View>
            <View style={styles.centerContainer}>
              <View style={styles.percentageBar}>
                {!!fight.votedNoUserIds.length && <View style={styles.grayTriangele} />}
                <View style={[styles.percentageNo, { width: percentage(fight.votedNoUserIds.length) }]} />
                {!!fight.votedYesUserIds.length && (
                <View
                  style={[
                    styles.redTriangele,
                    !fight.votedNoUserIds.length && { borderLeftColor: 'transparent' },
                  ]}
                />
                )}
                <View style={[styles.percentageYes, { width: percentage(fight.votedYesUserIds.length) }]} />
                <View
                  style={[
                    styles.blackTriangele,
                    !fight.votedYesUserIds.length && { borderLeftColor: colors.textSecondary },
                  ]}
                />
              </View>
            </View>
            <View style={[styles.votesContainer, styles.rightVotesContainer]}>
              {fight.votedYesUserIds.includes(userId) && <CheckmarkIcon style={styles.checkMark} />}
              <Text style={styles.votesText}>
                {percentage(fight.votedYesUserIds.length)}%
                - {t('Fight.yes')}
              </Text>
            </View>
          </View>
        )}
      </>
    );
  };

  const FIGHT_INFO = {
    [FIGHT_VIEW_TYPE.EVENT_UPCOMING]: () => (
      <View style={styles.location}>
        <Text style={[styles.text, styles.recordText]}>
          {`${firstFighterRecord.wins}-${firstFighterRecord.losses}-${firstFighterRecord.draws}`}
        </Text>
        <Text style={styles.text}>
          {titleCase(fight.fightersType)}
        </Text>
        <Text style={[styles.text, styles.recordText]}>
          {`${secondFighterRecord.wins}-${secondFighterRecord.losses}-${secondFighterRecord.draws}`}
        </Text>
      </View>
    ),
    [FIGHT_VIEW_TYPE.EVENT_PAST]: () => <PastFightInfo fight={fight} />,
    [FIGHT_VIEW_TYPE.PAST]: () => <PastFightInfo fight={fight} />,
    [FIGHT_VIEW_TYPE.IN_VOTING]: () => {
      return (
        <>
          {isResultsShown ? fightResults()
            : (
              <View>
                <Text style={styles.fightType}>
                  {FIGHT_TYPE_LABEL[fight.fightersType]} | {fight.fightersWeightCategory}
                </Text>
              </View>
            )}
        </>
      );
    },
    [FIGHT_VIEW_TYPE.VOTING_CLOSED]: () => fightResults(),
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
          <View style={styles.upcoming}>
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
    [FIGHT_VIEW_TYPE.APPROVED]: () => (
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
      {isCountdownShown ? <View style={styles.time} /> : <Countdown date={fight.votingFinishedOn} />}
      <View style={styles.fightersInfo}>
        <View style={styles.fighters}>
          <Fighter
            fighter={firstFighter}
            isWinner={firstFighter._id === fight.results?.winnerId}
            style={styles.fighter}
            onPress={onFighterPress}
            inVotingMode={inVotingMode}
          />
          <Text style={[styles.captionText, styles.vs]}>
            {t('Fight.vs')}
          </Text>
          <Fighter
            style={styles.fighter}
            fighter={secondFighter}
            isWinner={secondFighter._id === fight.results?.winnerId}
            onPress={onFighterPress}
            inVotingMode={inVotingMode}
          />
        </View>

        <View style={styles.line} />

        {FIGHT_INFO[viewType || fight.status]()}
      </View>
    </View>
  );
}

FightItem.propTypes = {
  fight: PropTypes.shape().isRequired,
  viewType: PropTypes.oneOf(Object.values(FIGHT_VIEW_TYPE)),
  inVotingMode: PropTypes.bool,
  isCountdownShown: PropTypes.bool,
};

FightItem.defaultProps = {
  viewType: null,
  inVotingMode: false,
  isCountdownShown: false,
};

export default React.memo(FightItem);
