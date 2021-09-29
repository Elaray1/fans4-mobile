import React, { useState, useCallback, useEffect } from 'react';
import {
  SafeAreaView, View, FlatList, ActivityIndicator, ScrollView, RefreshControl, AppState, Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused, useNavigation } from '@react-navigation/native';

import { useTranslation } from 'react-i18next';

import checkIfSubscriptionChanged from 'helpers/checkIfSubscriptionChanged';

import SearchFightersIcon from 'assets/icons/search-people';

import * as userSelectors from 'resources/user/user.selectors';
import * as userApi from 'resources/user/user.api';
import * as userActions from 'resources/user/user.actions';
import * as postApi from 'resources/post/post.api';

import Header from 'components/Header';
import Post from 'components/Post';
import Text from 'components/Text';

import useToast from 'hooks/useToast';
import useDidUpdate from 'hooks/useDidUpdate';

import colors from 'themes/colors';

import NoPostsIllustration from 'assets/illustrations/no-events';

import styles from './styles';

const PER_PAGE_COUNT = 20;
const POSTS_VIEWABILITY_CONFIG = { minimumViewTime: 0, itemVisiblePercentThreshold: 0 };

function Feed() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { showFailure } = useToast();
  const isFocused = useIsFocused();

  const fightersList = useSelector(userSelectors.getSupportedFighters);

  const [posts, setPosts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [viewablePosts, setViewablePosts] = useState({});

  const fetchNewItems = useCallback(async ({ refresh } = {}) => {
    if (!fightersList?.length) {
      return;
    }

    let fetchingPage = 1;
    let currentPosts = [];

    if (!refresh) {
      fetchingPage = page;
      currentPosts = posts;
    }

    if (fetchingPage === 1 || currentPosts.length < totalCount) {
      setIsLoading(true);

      try {
        const {
          posts: fetchedPosts,
          totalCount: fetchedTotalCount,
        } = await postApi.getMyFeedPosts({
          page: fetchingPage,
          perPage: PER_PAGE_COUNT,
        });

        setPage(fetchingPage + 1);
        setTotalCount(fetchedTotalCount);
        setPosts([...currentPosts, ...fetchedPosts]);
      } catch (error) {
        showFailure(t('Feed.couldntRefreshTheFeedPullToRefresh'));
      }

      setIsLoading(false);
    }
  }, [posts, page, totalCount, fightersList?.length, showFailure, t]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchNewItems({ refresh: true });
    setIsRefreshing(false);
  }, [fetchNewItems]);

  useEffect(() => {
    const fetchPosts = async () => {
      await fetchNewItems();
    };

    fetchPosts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateSubscriptionIfNeeded = useCallback(async () => {
    try {
      const fetchedUser = await userApi.getUserData();
      const isChanged = checkIfSubscriptionChanged(fightersList, fetchedUser.role.subscription.fighters);
      if (isChanged) {
        dispatch(userActions.setFanSubscriptions(fetchedUser?.role?.subscription?.fighters));
        onRefresh();
      }
    } catch (err) {
      console.error('getting user data error:', err);
    }
  }, [dispatch, fightersList, onRefresh]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', updateSubscriptionIfNeeded);
    return unsubscribe;
  }, [navigation, updateSubscriptionIfNeeded]);

  useEffect(() => {
    const checkSubscriptionsOnFocus = (appState) => {
      if (isFocused && appState === 'active') {
        updateSubscriptionIfNeeded();
      }
    };

    AppState.addEventListener('change', checkSubscriptionsOnFocus);

    return () => {
      AppState.removeEventListener('change', checkSubscriptionsOnFocus);
    };
  }, [isFocused, updateSubscriptionIfNeeded]);

  useDidUpdate(() => {
    if (!isFocused) {
      onRefresh();
    }
  }, [fightersList]);

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
          likedUserIds={item.likedUserIds}
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
    if (!isLoading) {
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

  const EmptyView = () => {
    return (
      !isLoading ? <NoPosts /> : <Loader />
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Header
        title={t('Feed.feed')}
        rightItemType="icon"
        onRightItemPress={onSearchFighters}
        rightItemIcon={SearchFightersIcon}
      />
      <View style={styles.content}>
        {isRefreshing && <Loader />}

        {!isRefreshing && Boolean(fightersList?.length) && (posts.length ? (
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
        ) : (
          <ScrollView
            contentContainerStyle={styles.emptyScroll}
            refreshControl={<RefreshControl refreshing={Platform.OS === 'ios' && isRefreshing} onRefresh={onRefresh} />}
            keyboardShouldPersistTaps="handled"
          >
            <EmptyView />
          </ScrollView>
        ))}

        <ScrollView
          contentContainerStyle={styles.emptyScroll}
          refreshControl={<RefreshControl refreshing={Platform.OS === 'ios' && isRefreshing} onRefresh={onRefresh} />}
          keyboardShouldPersistTaps="handled"
        >
          {!fightersList?.length && <NoSubscriptions />}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default React.memo(Feed);
