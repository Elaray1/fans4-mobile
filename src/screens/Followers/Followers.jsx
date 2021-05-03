import React, { useState, useCallback, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import * as userApi from 'resources/user/user.api';

import Header from 'components/Header';
import Text from 'components/Text';

import colors from 'themes/colors';

import styles from './Followers.styles';

const INITIAL_PAGE = 1;
const PER_PAGE = 25;

function Followers() {
  const [followers, setFollowers] = useState([]);
  const [page, setPage] = useState(INITIAL_PAGE);
  const [isAllFollowersLoaded, setIsAllFollowersLoaded] = useState(false);

  useEffect(() => {
    const initialLoad = async () => {
      const fetchedFollowers = await userApi.getUsers({
        myFollowers: true,
        page: INITIAL_PAGE,
        perPage: PER_PAGE,
      });

      if (fetchedFollowers.length < PER_PAGE) {
        setIsAllFollowersLoaded(true);
      } else {
        setIsAllFollowersLoaded(false);
      }
      setFollowers(fetchedFollowers);
      setPage(INITIAL_PAGE + 1);
    };
    initialLoad();
  }, []);

  const keyExtractor = useCallback(item => item._id, []);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.listItem}>
        <Text style={styles.listItemCity}>{item.fullName}</Text>
      </View>
    );
  };

  const renderItemSeparator = () => <View style={styles.line} />;

  const fetchMoreFollowers = useCallback(async () => {
    if (page !== INITIAL_PAGE && !isAllFollowersLoaded) {
      const newFollowers = await userApi.getUsers({
        page,
        perPage: PER_PAGE,
        myFollowers: true,
      });
      if (newFollowers.length < PER_PAGE) {
        setIsAllFollowersLoaded(true);
      } else {
        setIsAllFollowersLoaded(false);
      }
      setFollowers([...followers, ...newFollowers]);
    }
  }, [followers, page, isAllFollowersLoaded]);

  const handleLoadMore = useCallback(async () => {
    setPage(page + 1);
    await fetchMoreFollowers(page + 1);
  }, [fetchMoreFollowers, page]);

  const renderFooter = () => {
    if (isAllFollowersLoaded) {
      return null;
    }
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />
      <Header
        title="Followers"
        leftItemType="backArrow"
      />
      <FlatList
        data={followers}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={renderItemSeparator}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        initialNumToRender={25}
        ListFooterComponent={renderFooter}
      />
    </SafeAreaView>
  );
}

export default React.memo(Followers);
