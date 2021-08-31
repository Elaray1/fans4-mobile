import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { View, ActivityIndicator, SafeAreaView, StatusBar, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';

import Text from 'components/Text';
import Header from 'components/Header';
import Post from 'components/Post';

import useToast from 'hooks/useToast';

import { FANS4_ACCOUNT } from 'helpers/constants';

import * as userApi from 'resources/user/user.api';
import * as postApi from 'resources/post/post.api';

import colors from 'themes/colors';

import styles from './styles';

const INITIAL_PAGE = 1;
const PER_PAGE = 10;
const POSTS_VIEWABILITY_CONFIG = { minimumViewTime: 0, itemVisiblePercentThreshold: 0 };

function Fans4Profile() {
  const { t } = useTranslation();

  const { showFailure } = useToast();

  const [fans4Account, setFans4Account] = useState(null);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(INITIAL_PAGE);
  const [isAllPostsLoaded, setIsAllPostsLoaded] = useState(false);

  const [viewablePosts, setViewablePosts] = useState({});

  const init = useCallback(async () => {
    try {
      const [{
        fighter: fetchedFighter,
      }, {
        posts: fetchedPosts,
      },
      ] = await Promise.all([
        userApi.getFighter({ _id: FANS4_ACCOUNT._id }),
        postApi.getFighterPosts({
          page: INITIAL_PAGE,
          perPage: PER_PAGE,
          _id: FANS4_ACCOUNT._id,
        }),
      ]);

      if (fetchedPosts?.length < PER_PAGE) {
        setIsAllPostsLoaded(true);
      } else {
        setIsAllPostsLoaded(false);
      }

      setFans4Account(fetchedFighter);
      setPosts(fetchedPosts);
      setPage(INITIAL_PAGE + 1);
    } catch (error) {
      showFailure();
    }
  }, [showFailure]);

  useEffect(() => {
    init();
  }, [init]);

  const source = useMemo(() => ({ uri: fans4Account?.avatarUrl }), [fans4Account?.avatarUrl]);

  const keyExtractor = useCallback(item => item._id, []);

  const updateViewableItems = useCallback(({ viewableItems }) => {
    setViewablePosts(viewableItems.reduce((memo, item) => {
      memo[item.key] = true;
      return memo;
    }, {}));
  }, [setViewablePosts]);

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
        createdOn={item.createdOn}
        viewable={!!viewablePosts[item._id]}
      />
    );
  };

  const renderNoPosts = () => <Text style={styles.grayText}>{t('Fighter.checkBack')}</Text>;

  const renderItemSeparator = () => <View style={styles.space} />;

  const fetchMorePosts = useCallback(async () => {
    if (page !== INITIAL_PAGE && !isAllPostsLoaded) {
      const { posts: newPosts } = await postApi.getFighterPosts({
        page,
        perPage: PER_PAGE,
        _id: FANS4_ACCOUNT._id,
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

  const ProfileHeader = () => {
    return (
      <View>
        <View style={styles.fans4Container}>
          <FastImage style={styles.fans4Image} source={source} />
          <View>
            <Text style={styles.fans4FullName}>{fans4Account.fullName}</Text>
            <Text style={styles.fans4Text}>{t('Fans4Account.checkAllTheLatestNewsFromUs')}</Text>
          </View>
        </View>
        <View style={styles.fans4AboutContainer}>
          <Text style={styles.fans4AboutTitle}>{t('Fans4Account.aboutUs')}</Text>
          <Text style={styles.fans4Text}>{fans4Account.role.biography.about}</Text>
        </View>

        <View style={styles.line} />

        <Text style={[styles.blockTitle, styles.postsTitle]}>{t('Fans4Account.posts')}</Text>

      </View>
    );
  };

  return (
    <>
      <SafeAreaView style={styles.screen}>
        <StatusBar barStyle="light-content" backgroundColor={colors.main} />
        <Header
          title={t('Fans4Account.profile')}
          leftItemType="backArrow"
        />

        {fans4Account ? (
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
    </>
  );
}

export default React.memo(Fans4Profile);
