import React, { useState, useCallback, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  FlatList,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import useToast from 'hooks/useToast';

import * as userApi from 'resources/user/user.api';

import Header from 'components/Header';
import Text from 'components/Text';
import CustomRefreshControl from 'components/CustomRefreshControl';

import NoFightsIllustration from 'assets/illustrations/no-events.svg';

import colors from 'themes/colors';

import styles from './Fans.styles';

function Fans() {
  const { t } = useTranslation();
  const { showFailure } = useToast();

  const [fans, setFans] = useState([]);

  const [isRefreshing, setIsRefreshing] = useState(true);
  const [isFetchedFirstTime, setIsFetchedFirstTime] = useState(false);

  const fetchFans = useCallback(async () => {
    setIsRefreshing(true);

    try {
      const { fans: fetchedFans } = await userApi.getMyFans();

      setFans(fetchedFans);
    } catch (error) {
      console.error(error);
      showFailure();
    }


    if (!isFetchedFirstTime) {
      setIsFetchedFirstTime(true);
    }

    setIsRefreshing(false);
  }, [showFailure, isFetchedFirstTime]);

  useEffect(() => {
    const initialLoad = async () => {
      await fetchFans();
    };

    initialLoad();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const keyExtractor = useCallback(item => item._id, []);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.listItem}>
        <Text style={styles.listItemCity}>{item.role.biography.userName}</Text>
      </View>
    );
  };

  const renderItemSeparator = () => <View style={styles.line} />;

  const EmptyView = () => (
    <View style={styles.emptyView}>
      <NoFightsIllustration style={styles.illustration} />
      <Text style={styles.titleText}>{t('Fans.noFans')}</Text>
      <Text style={styles.text}>{t('Fans.nothingYet')}</Text>
    </View>
  );

  const onRefresh = useCallback(async () => {
    await fetchFans();
  }, [fetchFans]);

  const RefreshControl = (
    <CustomRefreshControl
      refreshing={isRefreshing}
      onRefresh={onRefresh}
    />
  );

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />
      <Header
        title={t('Fans.fans')}
        leftItemType="backArrow"
      />

      {!isFetchedFirstTime && isRefreshing && (
        <ScrollView
          refreshControl={RefreshControl}
          keyboardShouldPersistTaps="handled"
        />
      )}

      {!!fans.length && (
        <FlatList
          data={fans}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={renderItemSeparator}
          onEndReachedThreshold={0.3}
          initialNumToRender={1000}
          refreshControl={RefreshControl}
        />
      )}

      {isFetchedFirstTime && !fans.length && <EmptyView />}
    </SafeAreaView>
  );
}

export default React.memo(Fans);
