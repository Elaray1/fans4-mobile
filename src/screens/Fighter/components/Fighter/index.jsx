import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, View, StatusBar, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

import colors from 'themes/colors';

import Header from 'components/Header';
import Profile from 'components/FighterAccount/Profile';
import Statistic from 'components/FighterAccount/Statistic';
import Biography from 'components/FighterAccount/Biography';
import PersonalInfo from 'components/FighterAccount/PersonalInfo';
import Fans4Profile from 'screens/Fighter/components/Fans4Profile';
import Post from 'components/Post';
import Text from 'components/Text';

import * as userApi from 'resources/user/user.api';
import * as userSelectors from 'resources/user/user.selectors';
import * as fightApi from 'resources/fight/fight.api';
import * as postApi from 'resources/post/post.api';

import { FANS4_ACCOUNT } from 'helpers/constants';
import { FIGHT_STATUSES } from 'resources/fight/fight.constants';
import { USER_STATUSES } from 'resources/user/user.constants';

import analyticsService from 'services/analytics.service';

import ApplyForAFight from './components/applyForAFight';
import styles from './styles';

const INITIAL_PAGE = 1;
const PER_PAGE = 10;
const POSTS_VIEWABILITY_CONFIG = { minimumViewTime: 0, itemVisiblePercentThreshold: 0 };

function Fighter({ fighterId }) {
  const { t } = useTranslation();

  const [fighter, setFighter] = useState(null);
  const [postsCount, setPostsCount] = useState(null);
  const [posts, setPosts] = useState([]);
  const [fansCount, setFansCount] = useState(null);
  const [fight, setFight] = useState(null);
  const [page, setPage] = useState(INITIAL_PAGE);
  const [isAllPostsLoaded, setIsAllPostsLoaded] = useState(false);

  const [viewablePosts, setViewablePosts] = useState({});

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
        if (fighterId === FANS4_ACCOUNT._id) {
          const [{
            fighter: fetchedFighter,
            postsCount: fetchedPostsCount,
          }, {
            posts: fetchedPosts,
          },
          ] = await Promise.all([
            userApi.getFighter({ _id: fighterId }),
            postApi.getFighterPosts({
              page: INITIAL_PAGE,
              perPage: PER_PAGE,
              _id: fighterId,
            }),
          ]);

          if (fetchedPosts?.length < PER_PAGE) {
            setIsAllPostsLoaded(true);
          } else {
            setIsAllPostsLoaded(false);
          }

          setFighter(fetchedFighter);
          setPostsCount(fetchedPostsCount);
          setPosts(fetchedPosts);
          setPage(INITIAL_PAGE + 1);
        } else {
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
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, [fighterId, userId]);

  const fetchMorePosts = useCallback(async () => {
    if (page !== INITIAL_PAGE && !isAllPostsLoaded) {
      const { posts: newPosts } = await postApi.getFighterPosts({
        page,
        perPage: PER_PAGE,
        _id: fighterId,
      });
      if (newPosts.length < PER_PAGE) {
        setIsAllPostsLoaded(true);
      } else {
        setIsAllPostsLoaded(false);
      }
      setPosts([...posts, ...newPosts]);
    }
  }, [page, isAllPostsLoaded, fighterId, posts]);

  const handleLoadMore = useCallback(async () => {
    setPage(page + 1);
    await fetchMorePosts();
  }, [fetchMorePosts, page]);

  const updateViewableItems = useCallback(({ viewableItems }) => {
    setViewablePosts(viewableItems.reduce((memo, item) => {
      memo[item.key] = true;
      return memo;
    }, {}));
  }, [setViewablePosts]);

  const isFans4Account = useMemo(() => fighterId === FANS4_ACCOUNT._id, [fighterId]);

  const keyExtractor = useCallback(item => item._id, []);

  const renderNoPosts = () => <Text style={styles.grayText}>{t('Fighter.checkBack')}</Text>;

  const renderItemSeparator = () => <View style={styles.space} />;

  const renderItem = ({ item }) => {
    return (
      <Post
        _id={item._id}
        media={item.media}
        text={item.text}
        status={item.status}
        checkedOn={item.checkedOn}
        likedUserIds={item.likedUserIds}
        commentsCount={item.commentsCount}
        disabled={false}
        createdOn={item.createdOn}
        viewable={!!viewablePosts[item._id]}
      />
    );
  };

  const renderFooter = () => {
    if (isAllPostsLoaded) {
      return null;
    }

    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  };

  let FighterProfile;
  if (fighter) {
    FighterProfile = isFans4Account
      ? (
        <FlatList
          style={styles.content}
          data={posts}
          keyExtractor={keyExtractor}
          renderItem={posts ? renderItem : renderNoPosts}
          ItemSeparatorComponent={renderItemSeparator}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          initialNumToRender={10}
          // Do not pass function here cause of bug with remounting:
          // https://github.com/facebook/react-native/issues/13602#issuecomment-300608431
          ListHeaderComponent={<Fans4Profile fighter={fighter} />}
          ListFooterComponent={renderFooter}
          viewabilityConfig={POSTS_VIEWABILITY_CONFIG}
          onViewableItemsChanged={updateViewableItems}
        />
      )
      : (
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
      );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />

      <Header
        title={isFans4Account ? t('Fighter.profile') : t('Fighter.fightersProfile')}
        leftItemType="backArrow"
      />

      {fighter
        ? FighterProfile
        : (
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
