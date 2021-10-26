import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, View, StatusBar, ActivityIndicator, FlatList, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import moment from 'moment';

import colors from 'themes/colors';

import Header from 'components/Header';
import Text from 'components/Text';
import Profile from 'components/FighterAccount/Profile';
import Statistic from 'components/FighterAccount/Statistic';
import Biography from 'components/FighterAccount/Biography';
import PersonalInfo from 'components/FighterAccount/PersonalInfo';
import Post from 'components/Post';

import * as userSelectors from 'resources/user/user.selectors';
import { FIGHTER_TYPES } from 'resources/user/user.constants';
import * as userApi from 'resources/user/user.api';
import * as postApi from 'resources/post/post.api';

import analyticsService from 'services/analytics.service';

import useToast from 'hooks/useToast';

import ConfirmedIosPurchase from '../ConfirmedIosPurhase';
import ActionButtonsForFan from '../ActionButtonsForFan';
import useSubscribing from '../../hooks/useSubscribing';
import styles from './styles';

const INITIAL_PAGE = 1;
const PER_PAGE = 10;
const POSTS_VIEWABILITY_CONFIG = { minimumViewTime: 0, itemVisiblePercentThreshold: 0 };

function Fighter({ fighterId }) {
  const { showFailure } = useToast();
  const { t } = useTranslation();

  const userSubscriptions = useSelector(userSelectors.getSupportedFighters);

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

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFetchedFirstTime, setIsFetchedFirstTime] = useState(false);

  const {
    resubscribe,
    subscribe,
    isMakingPurchase,
    finishMakingPurchaseAfterSucessPayment,
    unsubscribe,
  } = useSubscribing({ fighterId });

  const refreshContent = useCallback(async () => {
    setIsRefreshing(true);

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

      if (!isFetchedFirstTime) {
        setIsFetchedFirstTime(true);
      }

      setFighter(fetchedFighter);
      setPostsCount(fetchedPostsCount);
      setFansCount(fetchedFansCount);
      setPosts(fetchedPosts);
      setPage(INITIAL_PAGE + 1);
    } catch (error) {
      showFailure();
    }

    setIsRefreshing(false);
  }, [fighterId, showFailure, isFetchedFirstTime]);

  useEffect(() => {
    const init = async () => {
      await refreshContent();
    };

    init();
  }, []);

  useEffect(() => {
    if (isSubscribed) {
      refreshContent();
    }
  }, [refreshContent, isSubscribed]);

  useEffect(() => {
    analyticsService.logEvent({
      name: analyticsService.events.FAN_OPENED_FIGHTER_SCREEN,
    });
  }, []);

  const onRefresh = useCallback(async () => {
    await refreshContent();
  }, [refreshContent]);

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
        author={item.author}
        status={item.status}
        checkedOn={item.checkedOn}
        likedUsers={item.likedUsers}
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
        fighterType={fighter.role.fighterType}
      />

      <View style={styles.line} />

      <View style={styles.postsAndFansBlock}>
        <ActionButtonsForFan
          subscribe={subscribe}
          unsubscribe={unsubscribe}
          fighter={fighter}
          resubscribe={resubscribe}
        />

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
      <Modal visible={isMakingPurchase} animationType="slide">
        <View style={styles.processingIosPurchaseModalContainer}>
          {!isSubscribed && (
            <>
              <ActivityIndicator size="large" />
              <Text style={styles.processingIosPurchaseTitle}>{t('Fighter.processingIosPurchaseTitle')}</Text>
              <Text style={styles.processingIosPurchaseInfoText}>{t('Fighter.processingIosPurchaseInfoText1')}</Text>
              <Text style={styles.processingIosPurchaseInfoText}>{t('Fighter.processingIosPurchaseInfoText2')}</Text>
            </>
          )}

          {isSubscribed && <ConfirmedIosPurchase handleDonePress={finishMakingPurchaseAfterSucessPayment} />}
        </View>
      </Modal>

      <StatusBar barStyle="light-content" backgroundColor={colors.main} />

      <Header
        title={t('Fighter.fightersProfile')}
        leftItemType="backArrow"
      />

      {fighter && postsCount !== null && fansCount !== null && (
        <FlatList
          style={styles.content}
          data={posts}
          keyExtractor={keyExtractor}
          renderItem={(posts || !isSubscribed) ? renderItem : renderNoPosts}
          ItemSeparatorComponent={renderItemSeparator}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          initialNumToRender={10}
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          // Do not pass function here cause of bug with remounting:
          // https://github.com/facebook/react-native/issues/13602#issuecomment-300608431
          ListHeaderComponent={ProfileHeader}
          ListFooterComponent={renderFooter}
          viewabilityConfig={POSTS_VIEWABILITY_CONFIG}
          onViewableItemsChanged={updateViewableItems}
        />
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
