import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, View, StatusBar, ActivityIndicator, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import moment from 'moment';

import colors from 'themes/colors';

import Header from 'components/Header';
import Button from 'components/Button';
import Text from 'components/Text';
import Profile from 'components/FighterAccount/Profile';
import Statistic from 'components/FighterAccount/Statistic';
import Biography from 'components/FighterAccount/Biography';
import PersonalInfo from 'components/FighterAccount/PersonalInfo';
import Post from 'components/Post';

import useDidUpdate from 'hooks/useDidUpdate';


import * as userSelectors from 'resources/user/user.selectors';
import { FIGHTING_STATUSES, USER_STATUSES } from 'resources/user/user.constants';
import * as userApi from 'resources/user/user.api';
import * as postApi from 'resources/post/post.api';

import analyticsService from 'services/analytics.service';

import styles from './styles';

const INITIAL_PAGE = 1;
const PER_PAGE = 10;
const POSTS_VIEWABILITY_CONFIG = { minimumViewTime: 0, itemVisiblePercentThreshold: 0 };

function Fighter({ fighterId }) {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const userSubscriptions = useSelector(userSelectors.getSupportedFighters);
  const userId = useSelector(userSelectors.getUserId);

  const isSubscribed = useMemo(() => !!userSubscriptions.find((f) => {
    const isBeforeRenewalDate = moment(f.renewalDate).isAfter(new Date());
    const isBeforeGracePeriodEndDate = moment(f.gracePeriodEndDate).isAfter(new Date());

    return f._id === fighterId && (isBeforeRenewalDate || isBeforeGracePeriodEndDate);
  }), [fighterId, userSubscriptions]);

  const [fighter, setFighter] = useState(null);
  const [postsCount, setPostsCount] = useState(null);
  const [fansCount, setFansCount] = useState(null);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(INITIAL_PAGE);
  const [isAllPostsLoaded, setIsAllPostsLoaded] = useState(false);

  const [viewablePosts, setViewablePosts] = useState({});

  const goToProposeAFight = useCallback(() => {
    navigation.navigate('ProposeAFight', { preselectedFighterId: fighter._id });
  }, [navigation, fighter]);

  const init = useCallback(async () => {
    try {
      const [{
        fighter: fetchedFighter,
        postsCount: fetchedPostsCount,
        fansCount: fetchedFansCount,
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
      setFansCount(fetchedFansCount);
      setPosts(fetchedPosts);
      setPage(INITIAL_PAGE + 1);
    } catch (error) {
      console.error(error);
    }
  }, [fighterId]);

  useDidUpdate(async () => {
    if (isSubscribed) {
      init();
    }
  }, [init, isSubscribed]);

  useEffect(() => {
    analyticsService.logEvent({
      name: analyticsService.events.FAN_OPENED_FIGHTER_SCREEN,
      data: {
        userId,
      },
    });
  }, [userId]);

  useEffect(() => {
    init();
  }, [init, fighterId]);

  const keyExtractor = useCallback(item => item._id, []);

  const updateViewableItems = useCallback(({ viewableItems }) => {
    setViewablePosts(viewableItems.reduce((memo, item) => {
      memo[item.key] = true;
      return memo;
    }, {}));
  }, [setViewablePosts]);

  const renderItem = ({ item }) => {
    const isDisabled = !userSubscriptions.map(f => f._id).includes(item.author._id);

    return (
      <Post
        _id={item._id}
        media={item.media}
        text={item.text}
        status={item.status}
        checkedOn={item.checkedOn}
        likedUserIds={item.likedUserIds}
        commentsCount={item.commentsCount}
        disabled={isDisabled}
        createdOn={item.createdOn}
        viewable={!!viewablePosts[item._id]}
      />
    );
  };

  const ProfileHeader = !fighter ? null : (
    <View style={styles.flatListHeader}>
      <Profile
        avatarUrl={fighter.avatarUrl}
        fullName={fighter.fullName}
        nickname={fighter.role.biography.nickname}
        location={`${fighter.role.biography.hometown.cityName}, ${fighter.role.biography.hometown.stateCode}`}
        status={fighter.status}
        fightingStatus={fighter.role.fightingStatus}
      />

      <View style={styles.line} />

      <View style={styles.postsAndFansBlock}>
        {isSubscribed && (
          <>
            <Button
              style={styles.subscribedButton}
              type="done"
              title={t('Fighter.subscribed')}
            />

            {fighter.status === USER_STATUSES.BLOCKED ? (
              <Text style={styles.blockedSupportedFighterText}>
                {t('Fighter.subscribeToAnotherWhenBlocked')}
              </Text>
            ) : (
              <>
                {fighter.role.fightingStatus === FIGHTING_STATUSES.READY_FOR_FIGHTS && (
                <Button
                  title={t('Fighter.proposeAFight')}
                  style={styles.applyButton}
                  onPress={goToProposeAFight}
                />
                )}
              </>
            )}
          </>
        )}

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

      <Text style={[styles.blockTitle, styles.postsTitle]}>{t('Account.Posts')}</Text>
      {!userSubscriptions.map(f => f._id).includes(fighterId)
         && <Text style={styles.grayText}>{t('Account.subscribeToFighter')}</Text>}
    </View>
  );

  const renderNoPosts = () => <Text style={styles.grayText}>{t('Fighter.checkBack')}</Text>;

  const renderItemSeparator = () => <View style={styles.space} />;

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

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />

      <Header
        title={t('Fighter.fightersProfile')}
        leftItemType="backArrow"
      />

      {fighter ? (
        <FlatList
          style={styles.content}
          data={posts}
          keyExtractor={keyExtractor}
          renderItem={(posts || !isSubscribed) ? renderItem : renderNoPosts}
          ItemSeparatorComponent={renderItemSeparator}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          initialNumToRender={10}
          // Do not pass function here cause of bug with remounting:
          // https://github.com/facebook/react-native/issues/13602#issuecomment-300608431
          ListHeaderComponent={ProfileHeader}
          ListFooterComponent={renderFooter}
          viewabilityConfig={POSTS_VIEWABILITY_CONFIG}
          onViewableItemsChanged={updateViewableItems}
        />
      ) : (
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
