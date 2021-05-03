import React, { useCallback, useState, useEffect } from 'react';
import {
  SafeAreaView, View, StatusBar, Image, TouchableOpacity, FlatList, ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import colors from 'themes/colors';

import SettingsModal from 'components/SettingsModal';
import Header from 'components/Header';
import Text from 'components/Text';
import FighterStatus from 'components/FighterStatus';
import Post from 'components/Post';

import * as userApi from 'resources/user/user.api';
import * as postApi from 'resources/post/post.api';
import * as userSelectors from 'resources/user/user.selectors';

import ArrowUpIcon from 'assets/icons/arrow-up';
import ArrowDownIcon from 'assets/icons/arrow-down';

import styles from './Account.styles';

const INITIAL_PAGE = 1;
const PER_PAGE = 10;

function Account() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const fullName = useSelector(userSelectors.getUserFullName);
  const nickname = useSelector(userSelectors.getUserNickname);
  const hometown = useSelector(userSelectors.getHometown);
  const avatarUrl = useSelector(userSelectors.getAvatarUrl);
  const biography = useSelector(userSelectors.getUserBiographyAbout);
  const age = useSelector(userSelectors.getUserAge);
  const profileInfo = useSelector(userSelectors.getUserProfileInfo);

  const [postsCount, setPostsCount] = useState(null);
  const [followersCount, setFollowersCount] = useState(null);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isBiographyOpen, setIsBiographyOpen] = useState(!biography);
  const [isPersonalInfoOpen, setIsPersonalInfoOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(INITIAL_PAGE);
  const [isAllPostsLoaded, setIsAllPostsLoaded] = useState(false);

  useEffect(() => {
    const init = async () => {
      const [
        { count: fetchedPostsCount },
        { count: fetchedFollowersCount },
        fetchedPosts,
      ] = await Promise.all([
        postApi.getPostsCount(),
        userApi.getUsersCount({ myFollowers: true }),
        postApi.getPosts({ page: INITIAL_PAGE, perPage: PER_PAGE, my: true }),

      ]);
      setPostsCount(fetchedPostsCount);
      setFollowersCount(fetchedFollowersCount);
      setPosts(fetchedPosts);
    };

    init();
  }, []);

  const onBurgerPress = useCallback(() => {
    setIsSettingsVisible(true);
  }, []);

  const onSettingsClose = useCallback(() => {
    setIsSettingsVisible(false);
  }, []);

  const onFollowersPress = useCallback(() => {
    navigation.navigate('Followers');
  }, [navigation]);

  const onBiographyPress = useCallback(() => {
    setIsBiographyOpen(!isBiographyOpen);
  }, [isBiographyOpen]);

  const onAddBiographyPress = useCallback(() => {
    navigation.navigate('ChangeBiography');
  }, [navigation]);

  const onPersonalInfoPress = useCallback(() => {
    setIsPersonalInfoOpen(!isPersonalInfoOpen);
  }, [isPersonalInfoOpen]);

  const keyExtractor = useCallback(item => item._id, []);

  const renderItem = ({ item }) => {
    return (
      <Post
        description={item.content.text}
        type={item.content.type}
        status={item.status}
      />
    );
  };

  const renderItemSeparator = () => <View style={styles.space} />;

  const fetchMorePosts = useCallback(async (neededPage) => {
    if (neededPage !== INITIAL_PAGE && !isAllPostsLoaded) {
      const newPosts = await postApi.getPosts({ page: neededPage, perPage: PER_PAGE, my: true });
      if (newPosts.length < PER_PAGE) {
        setIsAllPostsLoaded(true);
      } else {
        setIsAllPostsLoaded(false);
      }
      console.log(newPosts);
      setPosts([...posts, ...newPosts]);
    }
  }, [posts, isAllPostsLoaded]);

  const handleLoadMore = useCallback(async () => {
    setPage(page + 1);
    await fetchMorePosts(page + 1);
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

  console.log(posts.length);

  const renderHeader = () => {
    return (
      <View style={styles.flatListHeader}>

        <View style={styles.profileBlock}>
          <Image
            style={styles.photoImage}
            source={{ uri: avatarUrl }}
          />
          <View>
            <Text style={styles.fullName}>{fullName}</Text>
            {nickname && (
            <Text style={styles.nickname}>
              “
              {nickname}
              ”
            </Text>
            )}
            <Text style={styles.location}>{hometown}</Text>
            <FighterStatus status="active" />
          </View>
        </View>

        <View style={[styles.line, styles.lineIndent]} />

        <View style={styles.profileBlock}>
          <View style={[styles.profileData, styles.profileLeftData]}>
            <Text style={styles.profileDataTitle}>{t('Account.posts')}</Text>
            <Text style={styles.profileDataText}>
              {postsCount === null
                ? <ActivityIndicator color={colors.white} />
                : postsCount
          }
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.profileData, styles.profileRightData]}
            activeOpacity={0.7}
            onPress={onFollowersPress}
          >
            <Text style={styles.profileDataTitle}>{t('Account.followers')}</Text>
            <Text style={styles.profileDataText}>
              {followersCount === null
                ? <ActivityIndicator color={colors.white} />
                : followersCount
          }
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.line} />

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.biographyBlock}
          onPress={onBiographyPress}
        >
          <View style={[styles.biographyData, !isBiographyOpen && styles.biographyClosedData]}>
            <Text style={styles.blockTitle}>{t('Account.biography')}</Text>
            {isBiographyOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </View>

          {isBiographyOpen && Boolean(biography)
      && <Text style={styles.biographyText}>{biography}</Text>}

          {isBiographyOpen && !biography
        && (
        <TouchableOpacity
          style={styles.addBiographyContainter}
          activeOpacity={0.7}
          onPress={onAddBiographyPress}
        >
          <Text style={styles.addBiographyText}>{t('Account.addBiography')}</Text>
        </TouchableOpacity>
        )
      }
        </TouchableOpacity>

        <View style={styles.line} />

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.biographyBlock}
          onPress={onPersonalInfoPress}
        >
          <View style={[styles.biographyData, !isPersonalInfoOpen && styles.biographyClosedData]}>
            <Text style={styles.blockTitle}>{t('Account.personalInfo')}</Text>
            {isPersonalInfoOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </View>

          {isPersonalInfoOpen
      && (
      <View style={styles.personalInfoContainer}>
        <View style={styles.personalInfoData}>
          <Text style={styles.profileDataTitle}>{t('Account.age')}</Text>
          <Text style={styles.personalInfoValue}>{age}</Text>
        </View>

        <View style={styles.personalInfoData}>
          <Text style={styles.profileDataTitle}>{t('Account.weight')}</Text>
          <Text style={styles.personalInfoValue}>{profileInfo?.weight}</Text>
        </View>

        <View style={styles.personalInfoData}>
          <Text style={styles.profileDataTitle}>{t('Account.height')}</Text>
          <Text style={styles.personalInfoValue}>{profileInfo?.height}</Text>
        </View>

        <View style={styles.personalInfoData}>
          <Text style={styles.profileDataTitle}>{t('Account.reach')}</Text>
          <Text style={styles.personalInfoValue}>{profileInfo?.reach}</Text>
        </View>
      </View>
      )}

        </TouchableOpacity>

        <View style={styles.line} />

        <Text style={[styles.blockTitle, styles.postsTitle]}>Posts</Text>

      </View>

    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />
      <SettingsModal
        visible={isSettingsVisible}
        onClose={onSettingsClose}
      />
      <Header
        title={t('Account.account')}
        rightItemType="menu"
        onRightItemPress={onBurgerPress}
      />

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
      />

    </SafeAreaView>
  );
}

export default React.memo(Account);
