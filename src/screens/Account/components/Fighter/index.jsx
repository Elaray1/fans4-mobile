import React, { useCallback, useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, FlatList, ActivityIndicator, AppState } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useScrollToTop } from '@react-navigation/native';

import colors from 'themes/colors';

import Text from 'components/Text';
import Post from 'components/Post';
import Modal from 'components/Modal';
import CustomRefreshControl from 'components/CustomRefreshControl';

import * as userApi from 'resources/user/user.api';
import * as postApi from 'resources/post/post.api';

import * as userSelectors from 'resources/user/user.selectors';
import * as postSelectors from 'resources/post/post.selectors';

import * as userActions from 'resources/user/user.actions';
import * as postActions from 'resources/post/post.actions';

import analyticsService from 'services/analytics.service';
import websocketsService from 'services/socket.service';

import * as rootNavigation from 'helpers/rootNavigation';

import useToast from 'hooks/useToast';

import FighterHeader from './FighterHeader';

import styles from './styles';

const INITIAL_PAGE = 1;
const PER_PAGE = 10;
const POSTS_VIEWABILITY_CONFIG = { minimumViewTime: 0, itemVisiblePercentThreshold: 0 };

function FighterAccount({ postId }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { showFailure } = useToast();

  const postsListRef = useRef(null);
  useScrollToTop(postsListRef);

  const userId = useSelector(userSelectors.getUserId);
  const isBankAccountWarning = useSelector(userSelectors.getIsBankAccountWarning);
  const completedUploadingPosts = useSelector(postSelectors.getCompletedUploadingPosts);

  const [fansCount, setFansCount] = useState(null);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(INITIAL_PAGE);
  const [postsCount, setPostsCount] = useState(null);
  const [viewablePosts, setViewablePosts] = useState({});

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFetchedFirstTime, setIsFetchedFirstTime] = useState(false);

  const [postIdToBeScrolled, setPostIdToBeScrolled] = useState(postId);

  const isAllPostsLoaded = useMemo(() => postsCount <= posts.length, [posts.length, postsCount]);
  const visiblePosts = useMemo(() => posts.filter(post => !post.isHiddenFromAuthor), [posts]);

  const refreshPosts = useCallback(async () => {
    const {
      posts: fetchedPosts,
      totalCount: fetchedPostsCount,
    } = await postApi.getMyPosts({ page: INITIAL_PAGE, perPage: PER_PAGE });

    setPostsCount(fetchedPostsCount);
    setPosts(fetchedPosts);
    setPage(INITIAL_PAGE + 1);
  }, []);

  const refreshFansCount = useCallback(async () => {
    const { totalCount: fansTotalCount } = await userApi.getMyFans();
    setFansCount(fansTotalCount);
  }, []);

  useEffect(() => {
    if (!postId) {
      const unsubscribe = navigation.addListener('focus', refreshPosts);
      return unsubscribe;
    }
  }, [navigation, refreshPosts, postId]);

  useEffect(() => {
    const listening = AppState.addEventListener('change', async (appState) => {
      if (appState === 'active') {
        refreshPosts();
      }
    });

    return () => listening.remove();
  }, [refreshPosts]);


  useEffect(() => {
    websocketsService.on('post:status-updated', refreshPosts);

    return () => {
      websocketsService.off('post:status-updated', refreshPosts);
    };
  }, [refreshPosts]);

  useEffect(() => {
    websocketsService.on('fighter:subscribers-updated', refreshFansCount);

    return () => {
      websocketsService.off('fighter:subscribers-updated', refreshFansCount);
    };
  }, [refreshFansCount]);


  const refreshContent = useCallback(async () => {
    setIsRefreshing(true);

    let fetchedFansCount;
    let fetchedPostsCount;
    let fetchedPosts;

    try {
      const [{ totalCount: fansTotalCount }, { posts: initPosts, totalCount: postsTotalCount }] = await Promise.all([
        userApi.getMyFans(),
        postApi.getMyPosts({ page: INITIAL_PAGE, perPage: PER_PAGE }),
      ]);

      fetchedFansCount = fansTotalCount;
      fetchedPostsCount = postsTotalCount;
      fetchedPosts = initPosts;
    } catch (err) {
      console.log('Account screen initialization error:', err);
      showFailure();
      return;
    }

    if (!isFetchedFirstTime) {
      setIsFetchedFirstTime(true);
    }

    setPostsCount(fetchedPostsCount);
    setFansCount(fetchedFansCount);
    setPosts(fetchedPosts);
    setPage(INITIAL_PAGE + 1);

    setIsRefreshing(false);
  }, [showFailure, isFetchedFirstTime]);

  useEffect(() => {
    const init = async () => {
      await refreshContent();
    };

    init();
  }, []);

  const onRefresh = useCallback(async () => {
    await refreshContent();
  }, [refreshContent]);

  useEffect(() => {
    const init = async () => {
      if (completedUploadingPosts.length) {
        await dispatch(postActions.removeCompletedUploadingPosts());
        await refreshPosts();
      }
    };

    init();
  }, [completedUploadingPosts.length, refreshPosts, dispatch]);

  const onAddBiographyPress = useCallback(() => {
    analyticsService.logEvent({ name: analyticsService.events.FIGHTER_ADD_BIOGRAPHY_STARTED });

    navigation.navigate('ChangeBiography');
  }, [navigation]);

  const onAddPostPress = useCallback(() => {
    rootNavigation.resetToScreen('NewPost', 'NewPost');
  }, []);

  const hideBankAccountWarning = useCallback(async () => {
    try {
      const user = await userApi.hideBankAccountWarning();

      dispatch(userActions.setUserData(user));
    } catch (error) {
      console.log('hideBankAccountWarning error:', error);
      showFailure();
    }
  }, [dispatch, showFailure]);

  const onCloseBankAccountModal = useCallback(async () => {
    await hideBankAccountWarning();
  }, [hideBankAccountWarning]);

  const onUpdateBankAccount = useCallback(async () => {
    await hideBankAccountWarning();
    navigation.navigate('Finances');
  }, [hideBankAccountWarning, navigation]);

  const keyExtractor = useCallback(item => item._id, []);

  const updateViewableItems = useCallback(({ viewableItems }) => {
    setViewablePosts(viewableItems.reduce((memo, item) => {
      memo[item.key] = true;
      return memo;
    }, {}));
  }, [setViewablePosts]);

  const onHidePostFromFeed = useCallback((updatedPost) => {
    setPosts(prevPosts => prevPosts.map(post => (post._id === updatedPost._id ? updatedPost : post)));
  }, []);

  const renderItem = ({ item }) => {
    const props = {
      ...(userId !== item.author._id && {
        author: item.author,
      }),
    };

    return (
      <Post
        _id={item._id}
        media={item.media}
        text={item.text}
        status={item.status}
        checkedOn={item.checkedOn}
        likedUsers={item.likedUsers}
        commentsCount={item.commentsCount}
        viewable={!!viewablePosts[item._id]}
        createdOn={item.createdOn}
        editedOn={item.editedOn}
        author={item.author}
        onHidePostFromFeed={onHidePostFromFeed}
        {...props}
      />
    );
  };

  const renderItemSeparator = () => <View style={styles.space} />;

  const fetchMorePosts = useCallback(async ({ scrollPostId, oldPosts, oldPage } = {}) => {
    if (page !== INITIAL_PAGE && !isAllPostsLoaded) {
      if (scrollPostId) {
        if (oldPosts.findIndex(post => post._id === scrollPostId) !== -1) {
          setPage(oldPage);
          setPosts(oldPosts);
        } else {
          const fetchPage = oldPage || page;
          const { posts: newPosts } = await postApi.getMyPosts({
            page: fetchPage,
            perPage: PER_PAGE,
          });

          if (newPosts.length) {
            await fetchMorePosts({ scrollPostId, oldPosts: [...oldPosts, ...newPosts], oldPage: fetchPage + 1 });
          }
        }
      } else {
        setPage(page + 1);
        const { posts: newPosts } = await postApi.getMyPosts({
          page,
          perPage: PER_PAGE,
        });
        setPosts([...posts, ...newPosts]);
      }
    }
  }, [page, isAllPostsLoaded, posts]);

  const updateIsScrollNeeded = useCallback(async () => {
    if (postId) {
      postsListRef.current.scrollToOffset({ offset: 0, animated: true });
      const wait = new Promise(resolve => setTimeout(resolve, 300));
      wait.then(async () => {
        await refreshPosts();
        setPostIdToBeScrolled(postId);
      });
    }
  }, [postId, refreshPosts]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', updateIsScrollNeeded);
    return unsubscribe;
  }, [navigation, updateIsScrollNeeded]);


  useEffect(() => {
    const fetchPostToScroll = async () => {
      if (postIdToBeScrolled) {
        const postIndex = posts?.findIndex(post => post._id === postId);
        if (postIndex !== -1) {
          postsListRef.current.scrollToIndex({
            index: postIndex,
            viewPosition: 0,
          });
          setPostIdToBeScrolled(null);
        } else {
          await fetchMorePosts({ scrollPostId: postId, oldPosts: posts });
        }
      }
    };

    fetchPostToScroll();
  }, [postId, posts, postIdToBeScrolled, fetchMorePosts]);

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

  const renderNoItems = () => {
    if (!isAllPostsLoaded) {
      return null;
    }

    return (
      <View style={styles.noItemsContainer}>
        <Text style={styles.noItemsText}>{t('Account.addYourFirstPost')}</Text>
        <TouchableOpacity onPress={onAddPostPress}>
          <Text style={styles.noItemsButtonText}>{t('Account.addPost')}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const RefreshControl = (
    <CustomRefreshControl
      refreshing={isRefreshing}
      onRefresh={onRefresh}
    />
  );

  const Loader = () => (
    <View style={styles.refreshLoader}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  return (
    <>
      {isBankAccountWarning && (
        <Modal
          title={t('Account.updateBankAccount')}
          text={t('Account.toContinueReceivingIncomeUpdateYourBankAccountWithMoreDetails')}
          closeButtonText={t('Account.later')}
          submitButtonText={t('Account.update')}
          onClose={onCloseBankAccountModal}
          onSubmit={onUpdateBankAccount}
        />
      )}

      {!isFetchedFirstTime && isRefreshing && <Loader />}

      {postsCount !== null && fansCount !== null && (
        <FlatList
          ref={postsListRef}
          style={styles.content}
          data={visiblePosts}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={renderItemSeparator}
          onEndReached={fetchMorePosts}
          onEndReachedThreshold={0.1}
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          refreshControl={RefreshControl}
          initialNumToRender={PER_PAGE}
          ListHeaderComponent={(
            <FighterHeader
              postsCount={postsCount}
              fansCount={fansCount}
              onAddBiographyPress={onAddBiographyPress}
            />
          )}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderNoItems}
          onViewableItemsChanged={updateViewableItems}
          viewabilityConfig={POSTS_VIEWABILITY_CONFIG}
          onScrollToIndexFailed={(info) => {
            const wait = new Promise(resolve => setTimeout(resolve, 500));
            wait.then(() => {
              postsListRef.current?.scrollToIndex({ index: info.index, viewPosition: 0 });
            });
          }}
        />
      )}
    </>
  );
}

FighterAccount.propTypes = {
  postId: PropTypes.string,
};

FighterAccount.defaultProps = {
  postId: null,
};

export default React.memo(FighterAccount);
