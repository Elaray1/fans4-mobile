import React, { useState, useCallback, useEffect } from 'react';
import {
  SafeAreaView, View, FlatList, ActivityIndicator, ScrollView, RefreshControl, AppState, Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';

import { FANS4_ACCOUNT } from 'helpers/constants';

import NoPostsIllustration from 'assets/illustrations/no-events';
import SearchFightersIcon from 'assets/icons/search-people';

import * as userSelectors from 'resources/user/user.selectors';
import * as userApi from 'resources/user/user.api';
import * as userActions from 'resources/user/user.actions';
import * as postApi from 'resources/post/post.api';

import isSubscribedService from 'services/isSubscribed.service';

import Header from 'components/Header';
import Post from 'components/Post';
import Text from 'components/Text';

import useToast from 'hooks/useToast';

import colors from 'themes/colors';

import styles from './styles';

const PER_PAGE_COUNT = 20;
const POSTS_VIEWABILITY_CONFIG = { minimumViewTime: 0, itemVisiblePercentThreshold: 0 };

const checkIfSomeSubscriptionAddedOrRemoved = (oldSupportedFighters, newSupportedFighters) => {
  let oldOnes = (oldSupportedFighters || [])
    .filter(f => f._id !== FANS4_ACCOUNT._id && isSubscribedService.isSubscribed({ subscriptionToFighter: f }));

  let newOnes = (newSupportedFighters || [])
    .filter(f => f._id !== FANS4_ACCOUNT._id && isSubscribedService.isSubscribed({ subscriptionToFighter: f }));

  if (oldOnes.length !== newOnes.length) {
    return true;
  }

  oldOnes = _.sortBy(oldOnes, '_id');
  newOnes = _.sortBy(newOnes, '_id');

  return oldOnes.some((f, i) => {
    const oldSubscription = f;
    const newSubscription = newOnes[i];

    return oldSubscription._id !== newSubscription._id;
  });
};

function Feed() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { showFailure } = useToast();

  const fightersList = useSelector(userSelectors.getSupportedFighters);

  const [posts, setPosts] = useState([]);
  const [viewablePosts, setViewablePosts] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFetchedFirstTime, setIsFetchedFirstTime] = useState(false);

  const fetchNewItems = useCallback(async ({ refresh } = {}) => {
    if (isLoading) {
      return;
    }

    const fetchingPage = refresh ? 1 : page + 1;
    const currentPosts = refresh ? [] : posts;

    if (refresh || currentPosts.length < totalCount || !isFetchedFirstTime) {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      try {
        const {
          posts: fetchedPosts,
          totalCount: fetchedTotalCount,
        } = await postApi.getMyFeedPosts({
          page: fetchingPage,
          perPage: PER_PAGE_COUNT,
        });

        setPage(page + 1);
        setTotalCount(fetchedTotalCount);
        setPosts([...currentPosts, ...fetchedPosts]);
      } catch (error) {
        showFailure(t('Feed.couldntRefreshTheFeedPullToRefresh'));
      }

      if (!isFetchedFirstTime) {
        setIsFetchedFirstTime(true);
      }

      if (refresh) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  }, [posts, page, totalCount, showFailure, t, isFetchedFirstTime, isLoading]);

  const onRefresh = useCallback(async () => {
    await fetchNewItems({ refresh: true });
  }, [fetchNewItems]);

  const updateSubscriptionIfNeeded = useCallback(async () => {
    if (!isFetchedFirstTime) {
      return;
    }

    try {
      const fetchedUser = await userApi.getUserData();
      const isChanged = checkIfSomeSubscriptionAddedOrRemoved(fightersList, fetchedUser.role.subscription.fighters);

      if (isChanged) {
        dispatch(userActions.setUserData(fetchedUser));
        onRefresh();
      }
    } catch (err) {
      console.error('getting user data error:', err);
    }
  }, [dispatch, fightersList, onRefresh, isFetchedFirstTime]);

  useEffect(() => {
    fetchNewItems({ refresh: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const checkSubscriptionsWhenAppInForeground = (appState) => {
      if (appState === 'active') {
        updateSubscriptionIfNeeded();
      }
    };

    AppState.addEventListener('change', checkSubscriptionsWhenAppInForeground);
    return () => AppState.removeEventListener('change', checkSubscriptionsWhenAppInForeground);
  }, [updateSubscriptionIfNeeded, isFetchedFirstTime]);

  useEffect(() => {
    updateSubscriptionIfNeeded();
  }, [updateSubscriptionIfNeeded, fightersList]);

  const keyExtractor = useCallback(item => item._id, []);

  const updateViewableItems = useCallback(({ viewableItems }) => {
    setViewablePosts(viewableItems.reduce((memo, item) => {
      memo[item.key] = true;
      return memo;
    }, {}));
  }, [setViewablePosts]);

  const onUpdateCommentsCount = useCallback(async (postId) => {
    try {
      const updatedPost = await postApi.getPost(postId);

      const updatedPosts = posts.map((post) => {
        if (post._id === updatedPost._id) {
          return updatedPost;
        }
        return post;
      });

      setPosts(updatedPosts);
    } catch (error) {
      showFailure();
    }
  }, [showFailure, posts]);

  const onSearchFighters = useCallback(() => {
    navigation.navigate('SearchFighters');
  }, [navigation]);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.post} key={item._id}>
        <Post
          _id={item._id}
          media={item.media}
          text={item.text}
          status={item.status}
          checkedOn={item.checkedOn}
          author={item.author}
          likedUsers={item.likedUsers}
          commentsCount={item.commentsCount}
          viewable={!!viewablePosts[item._id]}
          createdOn={item.createdOn}
          onUpdateCommentsCount={onUpdateCommentsCount}
        />
      </View>
    );
  };

  const Loader = () => <View style={styles.loader}><ActivityIndicator size="large" color={colors.primary} /></View>;

  const renderFooter = () => {
    if (isRefreshing || !isLoading) {
      return null;
    }

    return <Loader />;
  };

  const NoSubscriptions = () => (
    <View style={styles.noSubscriptions}>
      <NoPostsIllustration style={styles.illustration} />
      <Text style={styles.titleText}>{t('Feed.noSubscriptionsYet')}</Text>
      <Text style={styles.text}>{t('Feed.beSureToSubscribe')}</Text>
    </View>
  );

  const NoPosts = () => (
    <View style={styles.noSubscriptions}>
      <NoPostsIllustration style={styles.illustration} />
      <Text style={styles.titleText}>{t('Feed.noPostsYet')}</Text>
      <Text style={styles.text}>{t('Feed.onceFighterWillAddPostsYouWillSeeThemHere')}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <Header
        title={t('Feed.feed')}
        rightItemType="icon"
        onRightItemPress={onSearchFighters}
        rightItemIcon={SearchFightersIcon}
      />

      <View style={styles.content}>
        {!!posts.length && (
          <FlatList
            data={posts}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            onEndReachedThreshold={0.3}
            onEndReached={fetchNewItems}
            style={styles.fightersList}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={renderFooter}
            onRefresh={onRefresh}
            refreshing={isRefreshing}
            viewabilityConfig={POSTS_VIEWABILITY_CONFIG}
            onViewableItemsChanged={updateViewableItems}
          />
        )}

        {isFetchedFirstTime && !posts.length && (
          <ScrollView
            contentContainerStyle={styles.emptyScroll}
            refreshControl={<RefreshControl refreshing={Platform.OS === 'ios' && isRefreshing} onRefresh={onRefresh} />}
            keyboardShouldPersistTaps="handled"
          >
            {!fightersList?.length ? <NoSubscriptions /> : <NoPosts />}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

export default React.memo(Feed);
