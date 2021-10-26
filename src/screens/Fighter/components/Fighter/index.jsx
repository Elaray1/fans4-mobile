import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, View, StatusBar, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
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
import { USER_STATUSES, FIGHTER_TYPES } from 'resources/user/user.constants';

import useToast from 'hooks/useToast';

import analyticsService from 'services/analytics.service';

import ApplyForAFight from './components/applyForAFight';
import styles from './styles';

function Fighter({ fighterId }) {
  const { showFailure } = useToast();
  const { t } = useTranslation();

  const userId = useSelector(userSelectors.getUserId);

  const [fighter, setFighter] = useState(null);
  const [postsCount, setPostsCount] = useState(null);
  const [fansCount, setFansCount] = useState(null);
  const [fight, setFight] = useState(null);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFetchedFirstTime, setIsFetchedFirstTime] = useState(false);

  useEffect(() => {
    analyticsService.logEvent({
      name: analyticsService.events.FIGHTER_OPENED_OTHER_FIGHTER_SCREEN,
    });
  }, []);

  const refreshContent = useCallback(async () => {
    setIsRefreshing(true);

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

      if (!isFetchedFirstTime) {
        setIsFetchedFirstTime(true);
      }

      setFight(fetchedFight);
      setFighter(fetchedFighter);
      setPostsCount(fetchedPostsCount);
      setFansCount(fetchedFansCount);
    } catch (error) {
      showFailure();
    }

    setIsRefreshing(false);
  }, [fighterId, isFetchedFirstTime, showFailure, userId]);

  useEffect(() => {
    const init = async () => {
      await refreshContent();
    };

    init();
  }, []);

  const onRefresh = useCallback(async () => {
    await refreshContent();
  }, [refreshContent]);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />

      <Header
        title={t('Fighter.fightersProfile')}
        leftItemType="backArrow"
      />

      {fighter && postsCount !== null && fansCount !== null && (
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          refreshControl={(
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
            />
        )}
        >
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
              fighterType={fighter.role.fighterType}
            />

            <View style={[styles.line, styles.lineIndent]} />

            <View style={styles.postsAndFansBlock}>
              <ApplyForAFight fight={fight} fighter={fighter} />

              <Statistic
                postsCount={postsCount}
                fansCount={fansCount}
                recordCount={fighter.role.fighterType === FIGHTER_TYPES.PRO
                  ? fighter.role.profile.recordPro : fighter.role.profile.record}
              />
            </View>

            <View style={styles.line} />

            <Biography
              userId={fighter._id}
              biography={fighter.role.biography.about}
              introVideo={fighter.role.biography.introVideo}
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
      )}

      {!isFetchedFirstTime && (
      <View style={styles.loaderWrapper}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
      )}
    </SafeAreaView>
  );
}

Fighter.propTypes = {
  fighterId: PropTypes.string.isRequired,
};

export default React.memo(Fighter);
