import React, { useCallback, useRef, useMemo, useState } from 'react';
import { SafeAreaView, View, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import moment from 'moment';

import NoPostsIllustration from 'assets/illustrations/no-events';
import SearchFightersIcon from 'assets/icons/search-people';

import * as userSelectors from 'resources/user/user.selectors';
import * as postApi from 'resources/post/post.api';
import { LIVE_STREAM_STATUSES } from 'resources/event/event.constants';

import FlatList from 'components/FlatList';
import Header from 'components/Header';
import Post from 'components/Post';
import Text from 'components/Text';
import CustomRefreshControl from 'components/CustomRefreshControl';
import AndroidStreamModal from 'components/AndroidStreamModal';

import useToast from 'hooks/useToast';

import colors from 'themes/colors';

import useFetch from './hooks/useFetch';
import useSubscriptionUpdated from './hooks/useSubscriptionUpdated';
import useViewableItems from './hooks/useViewableItems';
import useEventsLiveStreamsUpdated from './hooks/useEventsLiveStreamsUpdated';
import useAndroidStreamModal from './hooks/useAndroidStreamModal';

import WatchLiveStreamBanner from './components/WatchLiveStreamBanner';

import styles from './styles';

const POSTS_VIEWABILITY_CONFIG = { minimumViewTime: 0, itemVisiblePercentThreshold: 0 };

function Feed({ route }) {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { showFailure } = useToast();

  const fightersList = useSelector(userSelectors.getSupportedFighters);
  const isPaidSubscription = useSelector(userSelectors.getIsPaidSubscription);

  const [liveStreamEvent, setLiveStreamEvent] = useState();

  const postFromNotification = route?.params?.post;
  const [newPost, setNewPost] = useState(postFromNotification);

  const listRef = useRef(null);
  useScrollToTop(listRef);

  const {
    setPosts,
    onRefresh,
    isRefreshing,
    isLoading,
    isFetchedFirstTime,
    fetchNewItems,
    posts,
    liveStreamEvents: preloadedLiveStreamEvents,
  } = useFetch();

  useSubscriptionUpdated({ fetchNewItems, isFetchedFirstTime, onRefresh });
  const liveStreamEvents = useEventsLiveStreamsUpdated({ posts, preloadedEvents: preloadedLiveStreamEvents });

  const {
    eventLiveStreamAndroidModalRef,
    show: showAndroidStreamModal,
    isVisible: isAndroidStreamModalVisible,
    onClose: onAndroidStreamModalClose,
  } = useAndroidStreamModal();

  const {
    updateViewableItems,
    viewableItemsState,
  } = useViewableItems({ setLiveStreamEvent, isAndroidStreamModalVisible });

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
  }, [showFailure, posts, setPosts]);

  const onSearchFighters = useCallback(() => {
    navigation.navigate('SearchFighters');
  }, [navigation]);

  const onLiveStreamBannerPressAndroid = useCallback((event) => {
    if (event._id !== liveStreamEvent._id) {
      setLiveStreamEvent(event);
    }

    showAndroidStreamModal();
  }, [liveStreamEvent?._id, showAndroidStreamModal]);

  const keyExtractor = useCallback((item) => {
    const isEvent = !!item.liveStream;
    return isEvent ? `event_${item._id}` : `post_${item._id}`;
  }, []);

  const onRefreshing = useCallback(() => {
    setNewPost(null);
    onRefresh();
  }, [onRefresh]);

  const renderItem = ({ item }) => {
    const isEvent = !!item.liveStream;

    if (isEvent) {
      return (
        <WatchLiveStreamBanner
          onPress={Platform.OS === 'android' ? onLiveStreamBannerPressAndroid : undefined}
          event={item}
        />
      );
    }

    return (
      <Post
        _id={item._id}
        media={item.media}
        text={item.text}
        status={item.status}
        checkedOn={item.checkedOn}
        author={item.author}
        likedUsers={item.likedUsers}
        commentsCount={item.commentsCount}
        viewable={!!viewableItemsState[item._id]}
        createdOn={item.createdOn}
        editedOn={item.editedOn}
        onUpdateCommentsCount={onUpdateCommentsCount}
      />
    );
  };

  const Loader = () => <View style={styles.loader}><ActivityIndicator size="large" color={colors.primary} /></View>;

  const renderFooter = () => {
    if (isLoading && !isRefreshing) {
      return <Loader />;
    }

    return null;
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

  const RefreshControl = (
    <CustomRefreshControl
      refreshing={isRefreshing}
      onRefresh={onRefreshing}
    />
  );

  const items = useMemo(() => {
    let feed = _.sortBy([...posts, ...liveStreamEvents], (item) => {
      const isEvent = !!item.liveStream;
      return isEvent ? -moment(item.liveStream.startedOn).unix() : -moment(item.createdOn).unix();
    });
    if (newPost) {
      feed = feed.filter(i => i._id !== newPost._id);
      feed.unshift(newPost);
    }
    return feed;
  }, [posts, liveStreamEvents, newPost]);

  return (
    <SafeAreaView style={styles.screen}>
      {isPaidSubscription && Platform.OS === 'android' && liveStreamEvent && (
        <AndroidStreamModal
          eventId={liveStreamEvent._id}
          eventName={liveStreamEvent.name}
          eventLiveStreamStatus={liveStreamEvent.liveStream.status}
          ref={eventLiveStreamAndroidModalRef}
          onAndroidStreamModalClose={onAndroidStreamModalClose}
        />
      )}

      <Header
        title={t('Feed.feed')}
        rightItemType="icon"
        onRightItemPress={onSearchFighters}
        rightItemIcon={SearchFightersIcon}
      />

      {!isFetchedFirstTime && isRefreshing && <Loader />}

      <View style={styles.content}>
        {!!items.length && (
          <FlatList
            ref={listRef}
            contentContainerStyle={styles.posts}
            data={items}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            onEndReachedThreshold={0.3}
            onEndReached={fetchNewItems}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={renderFooter}
            onRefresh={onRefresh}
            refreshing={isRefreshing}
            refreshControl={RefreshControl}
            viewabilityConfig={POSTS_VIEWABILITY_CONFIG}
            onViewableItemsChanged={updateViewableItems}
            ItemSeparatorComponent={({ leadingItem }) => {
              const isHiddenEventWithFinishedStream = leadingItem.liveStream
                && leadingItem.liveStream.status !== LIVE_STREAM_STATUSES.LIVE;

              if (isHiddenEventWithFinishedStream) {
                return null;
              }

              return <View style={styles.separator} />;
            }}
          />
        )}

        {isFetchedFirstTime && !items.length && (
          <ScrollView
            contentContainerStyle={styles.emptyScroll}
            refreshControl={RefreshControl}
            keyboardShouldPersistTaps="handled"
          >
            {!fightersList?.length ? <NoSubscriptions /> : <NoPosts />}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

Feed.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      post: PropTypes.shape(),
    }),
  }).isRequired,
};

export default React.memo(Feed);
