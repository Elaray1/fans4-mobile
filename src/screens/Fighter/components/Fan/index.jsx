import React, {
  useState, useEffect, useMemo, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView, View, StatusBar, ActivityIndicator, FlatList,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

import colors from 'themes/colors';

import Header from 'components/Header';
import Button from 'components/Button';
import Text from 'components/Text';
import Profile from 'components/FighterAccount/Profile';
import Statistic from 'components/FighterAccount/Statistic';
import Biography from 'components/FighterAccount/Biography';
import PersonalInfo from 'components/FighterAccount/PersonalInfo';
import Post from 'components/Post';

import * as userSelectors from 'resources/user/user.selectors';
import * as userApi from 'resources/user/user.api';
import * as postApi from 'resources/post/post.api';

import styles from './styles';

const INITIAL_PAGE = 1;
const PER_PAGE = 10;

function Fighter({ fighterId }) {
  const { t } = useTranslation();

  const fightersList = useSelector(userSelectors.getSubscribedFighters);

  const isSubscribed = useMemo(() => Boolean(fightersList.find(_id => _id === fighterId)),
    [fighterId, fightersList]);

  const [fighter, setFighter] = useState(null);
  const [postsCount, setPostsCount] = useState(null);
  const [fansCount, setFansCount] = useState(null);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(INITIAL_PAGE);
  const [isAllPostsLoaded, setIsAllPostsLoaded] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const [{
          fighter: fetchedFighter,
          postsCount: fetchedPostsCount,
          fansCount: fetchedFansCount,
        }, {
          posts: fetchedPosts,
        },
        ] = await Promise.all([
          userApi.getOtherFighter({ _id: fighterId }),
          postApi.getPosts({
            page: INITIAL_PAGE,
            perPage: PER_PAGE,
            authorId: fighterId,
          }),
        ]);

        if (fetchedPosts?.length < PER_PAGE) {
          setIsAllPostsLoaded(true);
        } else {
          setIsAllPostsLoaded(false);
        }

        setFighter(fetchedFighter);
        setPostsCount(fetchedPostsCount);
        setFansCount(fetchedFansCount);
        setPosts(fetchedPosts);
        setPage(INITIAL_PAGE + 1);
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, [fighterId]);

  const keyExtractor = useCallback(item => item._id, []);

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
      />
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.flatListHeader}>
        <Profile
          avatarUrl={fighter.avatarUrl}
          fullName={fighter.fullName}
          nickname={fighter.role.biography.nickname}
          location={`${fighter.role.biography.hometown.cityName}, ${fighter.role.biography.hometown.stateCode}`}
          fightingStatus={fighter.role.fightingStatus}
        />

        <View style={styles.line} />

        <View style={styles.postsAndFansBlock}>
          {isSubscribed && (
            <>
              <Button
                style={styles.subscribedButton}
                type="done"
                title={t('Fighter.subscribed')}
              />
              <Button
                title={t('Fighter.proposeAFight')}
                style={styles.applyButton}
              />
            </>
          )}

          <Statistic
            postsCount={postsCount}
            fansCount={fansCount}
          />
        </View>

        <View style={styles.line} />

        <Biography
          biography={fighter.role.biography.about}
        />


        <View style={styles.line} />

        <PersonalInfo
          age={dayjs().diff(fighter.role.biography.birthdate, 'year')}
          weight={fighter.role.profile.weight}
          height={fighter.role.profile.height}
          reach={fighter.role.profile.reach}
        />

        <View style={styles.line} />

        <Text style={[styles.blockTitle, styles.postsTitle]}>{t('Account.Posts')}</Text>
      </View>
    );
  };

  const renderItemSeparator = () => <View style={styles.space} />;

  const fetchMorePosts = useCallback(async () => {
    if (page !== INITIAL_PAGE && !isAllPostsLoaded) {
      const { posts: newPosts } = await postApi.getPosts({
        page,
        perPage: PER_PAGE,
        authorId: fighterId,
      });
      if (newPosts.length < PER_PAGE) {
        setIsAllPostsLoaded(true);
      } else {
        setIsAllPostsLoaded(false);
      }
      setPosts([...posts, ...newPosts]);
    }
  }, [page, isAllPostsLoaded, fighterId, posts]);

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

  return (
    <>
      {fighter ? (
        <SafeAreaView style={styles.screen}>
          <StatusBar barStyle="light-content" backgroundColor={colors.main} />
          <Header
            title={t('Fighter.fightersProfile')}
            leftItemType="backArrow"
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
      ) : (
        <View style={styles.loaderWrapper}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      )}
    </>
  );
}

Fighter.propTypes = {
  fighterId: PropTypes.string.isRequired,
};

export default React.memo(Fighter);
