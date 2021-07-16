import React, { useState, useCallback, useEffect } from 'react';
import {
  SafeAreaView, View, FlatList, ActivityIndicator, ScrollView, RefreshControl,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import * as userSelectors from 'resources/user/user.selectors';

import * as postApi from 'resources/post/post.api';

import Header from 'components/Header';
import Post from 'components/Post';
import Text from 'components/Text';

import useToast from 'hooks/useToast';

import colors from 'themes/colors';

import styles from './styles';

const PER_PAGE_COUNT = 10;

function Feed() {
  const { t } = useTranslation();
  const { showFailure } = useToast();

  const fightersList = useSelector(userSelectors.getSupportedFighters);

  const [posts, setPosts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const keyExtractor = useCallback(item => item._id, []);

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
      <View style={styles.illustration} />
      <Text style={styles.titleText}>{t('Feed.noSubscriptionsYet')}</Text>
      <Text style={styles.text}>{t('Feed.onceYouSubscribeToAFighterYouWillSeeAllOfThatFightersContentHere')}</Text>
    </View>
  );

  const NoPosts = () => (
    <View style={styles.noSubscriptions}>
      <View style={styles.illustration} />
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
          />
        ) : (
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
            keyboardShouldPersistTaps="handled"
          >
            <EmptyView />
          </ScrollView>
        ))}
        {!fightersList?.length && <NoSubscriptions />}
      </View>
    </SafeAreaView>
  );
}

export default React.memo(Feed);
