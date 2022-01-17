import React, { useCallback, useRef } from 'react';
import { SafeAreaView, View, ActivityIndicator, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import NoPostsIllustration from 'assets/illustrations/no-events';
import SearchFightersIcon from 'assets/icons/search-people';

import * as userSelectors from 'resources/user/user.selectors';
import * as postApi from 'resources/post/post.api';


import FlatList from 'components/FlatList';
import Header from 'components/Header';
import Post from 'components/Post';
import Text from 'components/Text';
import CustomRefreshControl from 'components/CustomRefreshControl';

import useToast from 'hooks/useToast';

import colors from 'themes/colors';

import useFetch from './hooks/useFetch';
import useSubscriptionUpdated from './hooks/useSubscriptionUpdated';
import useViewableItems from './hooks/useViewableItems';

import styles from './styles';

const POSTS_VIEWABILITY_CONFIG = { minimumViewTime: 0, itemVisiblePercentThreshold: 0 };

function Feed() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { showFailure } = useToast();

  const fightersList = useSelector(userSelectors.getSupportedFighters);

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
  } = useFetch();

  useSubscriptionUpdated({ fetchNewItems, isFetchedFirstTime, onRefresh });
  const { updateViewableItems, viewableItemsState } = useViewableItems();

  const keyExtractor = useCallback(item => item._id, []);

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
          viewable={!!viewableItemsState[item._id]}
          createdOn={item.createdOn}
          editedOn={item.editedOn}
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

  const RefreshControl = (
    <CustomRefreshControl
      refreshing={isRefreshing}
      onRefresh={onRefresh}
    />
  );

  return (
    <SafeAreaView style={styles.screen}>
      <Header
        title={t('Feed.feed')}
        rightItemType="icon"
        onRightItemPress={onSearchFighters}
        rightItemIcon={SearchFightersIcon}
      />

      {!isFetchedFirstTime && isRefreshing && <Loader />}

      <View style={styles.content}>
        {!!posts.length && (
          <FlatList
            ref={listRef}
            contentContainerStyle={isRefreshing ? styles.postsWhenRefreshing : styles.posts}
            data={posts}
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
          />
        )}

        {isFetchedFirstTime && !posts.length && (
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

export default React.memo(Feed);
