import React, { useCallback, useState, useEffect } from 'react';
import {
  View, TouchableOpacity, FlatList, ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import colors from 'themes/colors';

import Text from 'components/Text';
import Post from 'components/Post';
import Modal from 'components/Modal';

import * as userApi from 'resources/user/user.api';
import * as postApi from 'resources/post/post.api';

import * as userSelectors from 'resources/user/user.selectors';

import * as userActions from 'resources/user/user.actions';

import analyticsService from 'services/analytics.service';
import * as socketService from 'services/socket.service';

import * as rootNavigation from 'helpers/rootNavigation';

import useToast from 'hooks/useToast';

import FighterHeader from './FighterHeader';

import styles from './styles';

const INITIAL_PAGE = 1;
const PER_PAGE = 10;
const POSTS_VIEWABILITY_CONFIG = { minimumViewTime: 0, itemVisiblePercentThreshold: 0 };

function FighterAccount() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { showFailure } = useToast();

  const userId = useSelector(userSelectors.getUserId);
  const isUpdateBankAccountModal = useSelector(userSelectors.getIsUpdateBankAccountModal);

  const [postsCount, setPostsCount] = useState(null);
  const [fansCount, setFansCount] = useState(null);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(INITIAL_PAGE);
  const [isAllPostsLoaded, setIsAllPostsLoaded] = useState(false);
  const [viewablePosts, setViewablePosts] = useState({});

  const refreshPosts = useCallback(async () => {
    const {
      posts: fetchedPosts,
      totalCount: fetchedPostsCount,
    } = await postApi.getMyPosts({ page: INITIAL_PAGE, perPage: PER_PAGE });

    setPostsCount(fetchedPostsCount);
    setPosts(fetchedPosts);
    setPage(INITIAL_PAGE + 1);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', refreshPosts);
    return unsubscribe;
  }, [navigation, refreshPosts]);

  useEffect(() => {
    socketService.on('post:status-updated', refreshPosts);
    return () => {
      socketService.removeListener('post:status-updated', refreshPosts);
    };
  }, [refreshPosts]);

  useEffect(() => {
    const init = async () => {
      let fetchedFansCount;
      let fetchedPostsCount;
      let fetchedPosts;

      try {
        const [{ totalCount: fansTotalCount }, { posts: initPosts, totalCount: postsTotalCount }] = await Promise.all([
          userApi.getMyFans({ page: 1, perPage: 1 }),
          postApi.getMyPosts({ page: INITIAL_PAGE, perPage: PER_PAGE }),
        ]);

        fetchedFansCount = fansTotalCount;
        fetchedPostsCount = postsTotalCount;
        fetchedPosts = initPosts;
      } catch (err) {
        showFailure();
        return;
      }

      if (fetchedPosts?.length < PER_PAGE) {
        setIsAllPostsLoaded(true);
      } else {
        setIsAllPostsLoaded(false);
      }

      setPostsCount(fetchedPostsCount);
      setFansCount(fetchedFansCount);
      setPosts(fetchedPosts);
      setPage(INITIAL_PAGE + 1);
    };

    init();
  }, [userId, showFailure]);

  const onAddBiographyPress = useCallback(() => {
    analyticsService.logEvent({
      name: analyticsService.events.FIGHTER_ADD_BIOGRAPHY_STARTED,
      data: {
        userId,
      },
    });

    navigation.navigate('ChangeBiography');
  }, [navigation, userId]);

  const onAddPostPress = useCallback(() => {
    rootNavigation.resetToScreen('NewPost', 'NewPost');
  }, []);

  const hideBankAccountWarning = useCallback(async () => {
    try {
      const user = await userApi.hideBankAccountWarning();

      dispatch(userActions.setUserData(user));
    } catch (error) {
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
        likedUserIds={item.likedUserIds}
        commentsCount={item.commentsCount}
        viewable={!!viewablePosts[item._id]}
        {...props}
      />
    );
  };

  const renderItemSeparator = () => <View style={styles.space} />;

  const fetchMorePosts = useCallback(async () => {
    if (page !== INITIAL_PAGE && !isAllPostsLoaded) {
      const { posts: newPosts } = await postApi.getMyPosts({
        page,
        perPage: PER_PAGE,
      });

      if (newPosts.length < PER_PAGE) {
        setIsAllPostsLoaded(true);
      } else {
        setIsAllPostsLoaded(false);
      }
      setPosts([...posts, ...newPosts]);
    }
  }, [page, isAllPostsLoaded, posts]);

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

  return (
    <>
      {isUpdateBankAccountModal && (
      <Modal
        title={t('Account.updateBankAccount')}
        text={t('Account.toContinueReceivingIncomeUpdateYourBankAccountWithMoreDetails')}
        closeButtonText={t('Account.later')}
        submitButtonText={t('Account.update')}
        onClose={onCloseBankAccountModal}
        onSubmit={onUpdateBankAccount}
      />
      )}
      <FlatList
        style={styles.content}
        data={posts}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={renderItemSeparator}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        initialNumToRender={10}
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
      />
    </>
  );
}

export default React.memo(FighterAccount);
