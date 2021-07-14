import React, { useCallback, useState, useEffect } from 'react';
import {
  View, TouchableOpacity, FlatList, ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import colors from 'themes/colors';

import Text from 'components/Text';
import Post from 'components/Post';
import Profile from 'components/FighterAccount/Profile';
import Statistic from 'components/FighterAccount/Statistic';
import Biography from 'components/FighterAccount/Biography';
import PersonalInfo from 'components/FighterAccount/PersonalInfo';

import * as userApi from 'resources/user/user.api';
import * as postApi from 'resources/post/post.api';
import * as userSelectors from 'resources/user/user.selectors';
import * as rootNavigation from 'helpers/rootNavigation';

import styles from './styles';

const INITIAL_PAGE = 1;
const PER_PAGE = 10;

function FighterAccount() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const userId = useSelector(userSelectors.getUserId);
  const fullName = useSelector(userSelectors.getUserFullName);
  const nickname = useSelector(userSelectors.getUserNickname);
  const hometown = useSelector(userSelectors.getHometown);
  const fightingStatus = useSelector(userSelectors.getFightingStatus);
  const avatarUrl = useSelector(userSelectors.getAvatarUrl);
  const biography = useSelector(userSelectors.getUserBiographyAbout);
  const age = useSelector(userSelectors.getUserAge);
  const profileInfo = useSelector(userSelectors.getUserProfileInfo);

  const [postsCount, setPostsCount] = useState(null);
  const [fansCount, setFansCount] = useState(null);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(INITIAL_PAGE);
  const [isAllPostsLoaded, setIsAllPostsLoaded] = useState(false);

  useEffect(() => {
    const init = async () => {
      const [
        { totalCount: fetchedFansCount },
        { posts: fetchedPosts, totalCount: fetchedPostsCount },
      ] = await Promise.all([
        userApi.getMyFans({ page: 1, perPage: 1 }),
        postApi.getMyPosts({
          page: INITIAL_PAGE,
          perPage: PER_PAGE,
        }),
      ]);

      console.log('fetchedFansCount', fetchedFansCount);
      console.log('fetchedPostsCount', fetchedPostsCount);

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
  }, [userId]);

  const onFansPress = useCallback(() => {
    navigation.navigate('Fans');
  }, [navigation]);

  const onAddBiographyPress = useCallback(() => {
    navigation.navigate('ChangeBiography');
  }, [navigation]);

  const onAddPostPress = useCallback(() => {
    rootNavigation.resetToScreen('NewPost', 'NewPost');
  }, []);

  const keyExtractor = useCallback(item => item._id, []);

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
        {...props}
      />
    );
  };

  const renderItemSeparator = () => <View style={styles.space} />;

  const fetchMorePosts = useCallback(async () => {
    if (page !== INITIAL_PAGE && !isAllPostsLoaded) {
      const { posts: newPosts } = await postApi.getPosts({
        page,
        perPage: PER_PAGE,
        authorId: userId,
      });

      if (newPosts.length < PER_PAGE) {
        setIsAllPostsLoaded(true);
      } else {
        setIsAllPostsLoaded(false);
      }
      setPosts([...posts, ...newPosts]);
    }
  }, [page, isAllPostsLoaded, userId, posts]);

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

  const renderHeader = () => {
    return (
      <View style={styles.flatListHeader}>

        <Profile
          avatarUrl={avatarUrl}
          fullName={fullName}
          nickname={nickname}
          location={hometown}
          fightingStatus={fightingStatus}
        />

        <View style={styles.line} />

        <Statistic
          postsCount={postsCount}
          fansCount={fansCount}
          onFansPress={onFansPress}
          recordCount={profileInfo.record}
        />

        <View style={styles.line} />

        <Biography
          biography={biography}
          onAddBiographyPress={onAddBiographyPress}
        />

        <View style={styles.line} />

        <PersonalInfo
          age={age}
          weight={profileInfo?.weight}
          height={profileInfo?.height}
          reach={profileInfo?.reach}
        />

        <View style={styles.line} />

        <Text style={[styles.blockTitle, styles.postsTitle]}>{t('Account.Posts')}</Text>

      </View>

    );
  };

  const renderNoItems = () => {
    return (
      <View style={styles.noItemsContainer}>
        <Text style={styles.noItemsText}>{t('Account.OnceYouAddAPost')}</Text>
        <TouchableOpacity onPress={onAddPostPress}>
          <Text style={styles.noItemsButtonText}>{t('Account.AddPost')}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FlatList
      style={styles.content}
      data={posts}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ItemSeparatorComponent={renderItemSeparator}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.1}
      initialNumToRender={10}
      ListHeaderComponent={renderHeader} // we can't use flatlist inside of scrollview
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderNoItems}
    />
  );
}

export default React.memo(FighterAccount);
