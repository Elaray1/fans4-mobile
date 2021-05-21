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

import styles from './Fans.styles';

const INITIAL_PAGE = 1;
const PER_PAGE = 25;

function Fans() {
  const [fans, setFans] = useState([]);
  const [page, setPage] = useState(INITIAL_PAGE);
  const [isAllFansLoaded, setIsAllFansLoaded] = useState(false);

  useEffect(() => {
    const initialLoad = async () => {
      const fetchedFans = await userApi.getUsers({
        myFans: true,
        page: INITIAL_PAGE,
        perPage: PER_PAGE,
      });

      if (fetchedFans.length < PER_PAGE) {
        setIsAllFansLoaded(true);
      } else {
        setIsAllFansLoaded(false);
      }
      setFans(fetchedFans);
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

  const fetchMoreFans = useCallback(async () => {
    if (page !== INITIAL_PAGE && !isAllFansLoaded) {
      const newFans = await userApi.getUsers({
        page,
        perPage: PER_PAGE,
        myFans: true,
      });
      if (newFans.length < PER_PAGE) {
        setIsAllFansLoaded(true);
      } else {
        setIsAllFansLoaded(false);
      }
      setFans([...fans, ...newFans]);
    }
  }, [fans, page, isAllFansLoaded]);

  const handleLoadMore = useCallback(async () => {
    setPage(page + 1);
    await fetchMoreFans(page + 1);
  }, [fetchMoreFans, page]);

  const renderFooter = () => {
    if (isAllFansLoaded) {
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
        title="Fans"
        leftItemType="backArrow"
      />
      <FlatList
        data={fans}
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

export default React.memo(Fans);
