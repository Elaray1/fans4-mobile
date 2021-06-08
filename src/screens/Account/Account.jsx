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
import StatusBadge from 'components/StatusBadge';
import Post from 'components/Post';

import * as userApi from 'resources/user/user.api';
import * as postApi from 'resources/post/post.api';
import * as userSelectors from 'resources/user/user.selectors';
import * as rootNavigation from 'helpers/rootNavigation';

import ArrowUpIcon from 'assets/icons/arrow-up';
import ArrowDownIcon from 'assets/icons/arrow-down';

import styles from './Account.styles';

const INITIAL_PAGE = 1;
const PER_PAGE = 10;

function Account() {
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
        { count: fetchedFansCount },
        { posts: fetchedPosts },
      ] = await Promise.all([
        postApi.getPostsCount(),
        userApi.getUsersCount({ myFans: true }),
        postApi.getPosts({ page: INITIAL_PAGE, perPage: PER_PAGE, my: true }),
      ]);

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
  }, []);

  const onBurgerPress = useCallback(() => {
    setIsSettingsVisible(true);
  }, []);

  const onSettingsClose = useCallback(() => {
    setIsSettingsVisible(false);
  }, []);

  const onFansPress = useCallback(() => {
    navigation.navigate('Fans');
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
        likesCount={item.likedUserIds.length}
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
        my: true,
      });
      if (newPosts.length < PER_PAGE) {
        setIsAllPostsLoaded(true);
      } else {
        setIsAllPostsLoaded(false);
      }
      setPosts([...posts, ...newPosts]);
    }
  }, [posts, page, isAllPostsLoaded]);

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
            {fightingStatus && <StatusBadge status={fightingStatus} />}
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
            onPress={onFansPress}
          >
            <Text style={styles.profileDataTitle}>{t('Account.fans')}</Text>
            <Text style={styles.profileDataText}>
              {fansCount === null
                ? <ActivityIndicator color={colors.white} />
                : fansCount
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
        ListEmptyComponent={renderNoItems}
      />

    </SafeAreaView>
  );
}

export default React.memo(Account);
