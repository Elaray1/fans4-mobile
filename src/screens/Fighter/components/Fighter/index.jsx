import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, View, StatusBar, ScrollView, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

import colors from 'themes/colors';

import Header from 'components/Header';
import Profile from 'components/FighterAccount/Profile';
import Statistic from 'components/FighterAccount/Statistic';
import Biography from 'components/FighterAccount/Biography';
import PersonalInfo from 'components/FighterAccount/PersonalInfo';

import * as userApi from 'resources/user/user.api';
import * as userSelectors from 'resources/user/user.selectors';
import * as fightApi from 'resources/fight/fight.api';
import { FIGHT_STATUSES } from 'resources/fight/fight.constants';
import { USER_STATUSES } from 'resources/user/user.constants';

import analyticsService from 'services/analytics.service';

import ApplyForAFight from './components/applyForAFight';
import styles from './styles';

function Fighter({ fighterId }) {
  const { t } = useTranslation();

  const [fighter, setFighter] = useState(null);
  const [postsCount, setPostsCount] = useState(null);
  const [fansCount, setFansCount] = useState(null);
  const [fight, setFight] = useState(null);

  const userId = useSelector(userSelectors.getUserId);

  useEffect(() => {
    analyticsService.logEvent({
      name: analyticsService.events.FIGHTER_OPENED_OTHER_FIGHTER_SCREEN,
      data: {
        userId,
      },
    });
  }, [userId]);

  useEffect(() => {
    const init = async () => {
      try {
        const [
          {
            fighter: fetchedFighter,
            postsCount: fetchedPostsCount,
            fansCount: fetchedFansCount,
          },
          {
            fights: [fetchedFight],
          },
        ] = await Promise.all([
          userApi.getFighter({
            _id: fighterId,
          }),
          fightApi.getFights({
            betweenFighterIds: [fighterId, userId],
            statuses: [
              FIGHT_STATUSES.PENDING,
              FIGHT_STATUSES.APPROVED,
              FIGHT_STATUSES.UPCOMING,
              FIGHT_STATUSES.IN_VOTING,
              FIGHT_STATUSES.VOTING_CLOSED,
            ],
          }),
        ]);

        setFight(fetchedFight);
        setFighter(fetchedFighter);
        setPostsCount(fetchedPostsCount);
        setFansCount(fetchedFansCount);
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, [fighterId, userId]);

  if (!fighter) {
    return (
      <View style={styles.loaderWrapper}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />

      <Header
        title={t('Fighter.fightersProfile')}
        leftItemType="backArrow"
      />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.flatListHeader}>
          <Profile
            status={fighter.status}
            avatarUrl={fighter.avatarUrl}
            fullName={fighter.fullName}
            nickname={fighter.role.biography.nickname}
            location={`${fighter.role.biography.hometown.cityName}, ${fighter.role.biography.hometown.stateCode}`}
            fightingStatus={fighter.status === USER_STATUSES.BLOCKED
              ? USER_STATUSES.BLOCKED
              : fighter.role.fightingStatus}
          />

          <View style={[styles.line, styles.lineIndent]} />

          <View style={styles.postsAndFansBlock}>
            <ApplyForAFight fight={fight} fighter={fighter} />

            <Statistic
              postsCount={postsCount}
              fansCount={fansCount}
              recordCount={fighter.role.profile.record}
            />
          </View>

          <View style={styles.line} />

          <Biography
            biography={fighter.role.biography.about}
          />

          <View style={styles.line} />

          <PersonalInfo
            age={dayjs().diff(fighter.role.biography.birthdate, 'year')}
            weight={fighter.role.profile.weight}
            height={fighter.role.profile.height}
            reach={fighter.role.profile.reach}
          />

          <View style={styles.line} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

Fighter.propTypes = {
  fighterId: PropTypes.string.isRequired,
};

export default React.memo(Fighter);
