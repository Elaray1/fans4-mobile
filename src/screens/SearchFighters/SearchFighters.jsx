import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  SafeAreaView, View, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Platform, ScrollView,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import debounce from 'lodash.debounce';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import Header from 'components/Header';
import SearchInput from 'components/SearchInput';
import Text from 'components/Text';
import ScrollToTop from 'components/ScrollToTop';

import * as userApi from 'resources/user/user.api';
import { FIGHTER_TYPES, USER_TYPES } from 'resources/user/user.constants';
import * as userSelectors from 'resources/user/user.selectors';

import { toFixLength } from 'helpers/modifyText';
import { FANS4_ACCOUNT } from 'helpers/constants';

import useToast from 'hooks/useToast';

import analyticsService from 'services/analytics.service';

import NoFightsIllustration from 'assets/illustrations/no-events.svg';

import colors from 'themes/colors';

import styles from './SearchFighters.styles';

const PER_PAGE_COUNT = 20;

function SearchFighters() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { showFailure } = useToast();

  const [fans4Account, setFans4Account] = useState(null);
  const [fighters, setFighters] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchValue, setSearchValue] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFetchedFirstTime, setIsFetchedFirstTime] = useState(false);

  const doSearch = useCallback((v) => {
    setIsSearching(true);
    setSearchValue(v);
  }, []);

  const userType = useSelector(userSelectors.getUserType);

  useEffect(() => {
    const fetchFans4Account = async () => {
      try {
        const { fighter: fetchedFighter } = await userApi.getFighter({ _id: FANS4_ACCOUNT._id });

        setFans4Account(fetchedFighter);
      } catch (error) {
        console.error('fetchFans4Account error:', error);
        showFailure();
      }
    };

    fetchFans4Account();
  }, [showFailure]);

  useEffect(() => {
    if (userType === USER_TYPES.FIGHTER) {
      analyticsService.logEvent({
        name: analyticsService.events.FIGHTER_OPENED_FIGHTERS_SCREEN,
      });
    } else {
      analyticsService.logEvent({
        name: analyticsService.events.FAN_OPENED_FIGHTERS_SCREEN,
      });
    }
  }, [userType]);

  const fetchNewItems = useCallback(async ({ search = '', refresh } = {}) => {
    let fetchingPage = 1;
    let currentFighters = [];

    if (!refresh) {
      fetchingPage = page;
      currentFighters = fighters;
    }

    if (!isFetchedFirstTime || fighters.length < totalCount) {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      try {
        const {
          fighters: fetchedFighters,
          totalCount: fetchedTotalCount,
        } = await userApi.getFighters({
          page: fetchingPage,
          perPage: PER_PAGE_COUNT,
          searchValue: search,
        });

        setPage(fetchingPage + 1);
        setTotalCount(fetchedTotalCount);
        setFighters([...currentFighters, ...fetchedFighters]);
      } catch (error) {
        console.error(error);
      }

      if (!isFetchedFirstTime) {
        setIsFetchedFirstTime(true);
      }

      if (refresh) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }

    setIsSearching(false);
  }, [fighters, page, totalCount, isFetchedFirstTime]);

  const onRefresh = useCallback(async () => {
    await fetchNewItems({ refresh: true });
  }, [fetchNewItems]);

  const onSearchQueryChange = useRef(debounce(async (value) => {
    await fetchNewItems({ search: value, refresh: true });
  }, 500, { leading: false, trailing: true }));

  useEffect(() => {
    onSearchQueryChange.current(searchValue);
  }, [searchValue]);

  const onPressFighter = useCallback((fighterId) => {
    navigation.navigate('Fighter', { _id: fighterId });
  }, [navigation]);

  const onPressFans4Profile = useCallback(() => {
    navigation.navigate('Fans4Profile');
  }, [navigation]);

  const fans4Source = useMemo(() => ({ uri: fans4Account?.avatarUrl }), [fans4Account?.avatarUrl]);

  const renderItem = ({ item }) => {
    const { nickname } = item.role.biography;
    const { cityName, stateCode } = item.role.biography.hometown;

    return (
      <TouchableOpacity
        onPress={() => onPressFighter(item._id)}
      >
        <View style={styles.fighter}>
          <FastImage
            style={styles.fighterImage}
            source={{ uri: item.avatarUrl }}
          />
          {item.role.fighterType === FIGHTER_TYPES.PRO
          && (
          <View style={styles.proBadge}>
            <Text style={styles.proBadgeText}>{t('SearchFighters.p')}</Text>
          </View>
          )}
          <View>
            <Text style={styles.fullName}>{item.fullName}</Text>
            {nickname && (
              <Text style={styles.nickname}>
                “
                {toFixLength({ text: nickname, length: 30 })}
                ”
              </Text>
            )}

            <Text style={styles.city}>
              {toFixLength({ text: cityName, length: 30 })}
              ,
              {' '}
              {toFixLength({ text: stateCode, length: 30 })}
            </Text>
          </View>
        </View>

        <View style={styles.line} />
      </TouchableOpacity>
    );
  };

  const keyExtractor = useCallback(item => item._id, []);

  const renderFooter = () => {
    if (!isLoading) {
      return null;
    }

    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  };

  const EmptyView = () => (
    <View style={styles.emptyView}>
      <NoFightsIllustration style={styles.illustration} />
      <Text style={styles.titleText}>{t('SearchFighters.noFighters')}</Text>
      <Text style={styles.text}>{t('SearchFighters.youWillSeeThemHere')}</Text>
    </View>
  );

  const Fans4Account = fans4Account ? (
    <TouchableOpacity
      onPress={onPressFans4Profile}
      style={styles.fans4Container}
    >
      <FastImage style={styles.fans4Image} source={fans4Source} />
      <View>
        <Text style={styles.fans4FullName}>{fans4Account.fullName}</Text>
        <Text style={styles.fans4Text}>{t('SearchFighters.checkAllTheLatestNewsFromUs')}</Text>
      </View>
    </TouchableOpacity>
  ) : null;

  const Loader = () => <View style={styles.loader}><ActivityIndicator size="large" color={colors.primary} /></View>;

  return (
    <ScrollToTop>
      <SafeAreaView style={styles.screen}>
        <Header
          {...(userType === USER_TYPES.FAN && { leftItemType: 'backArrow' })}
          title={t('SearchFighters.fighters')}
        />

        <View style={styles.content}>
          <SearchInput
            value={searchValue}
            onChangeText={doSearch}
            placeholder={t('SearchFighters.search')}
          />

          {((!isFetchedFirstTime && isRefreshing) || isSearching) && <Loader />}

          {(!!fighters.length && !isSearching) && (
          <FlatList
            data={fighters}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            onEndReachedThreshold={0.3}
            onEndReached={fetchNewItems}
            onRefresh={onRefresh}
            refreshing={isRefreshing}
            style={styles.fightersList}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={searchValue ? null : Fans4Account}
            ListFooterComponent={renderFooter}
          />
          )}

          {(!isSearching && (isFetchedFirstTime && fighters.length <= (searchValue ? 0 : 1))) && (
          <ScrollView
            contentContainerStyle={styles.emptyScroll}
            refreshControl={<RefreshControl refreshing={Platform.OS === 'ios' && isRefreshing} onRefresh={onRefresh} />}
            keyboardShouldPersistTaps="handled"
          >
            <EmptyView />
          </ScrollView>
          )}
        </View>
      </SafeAreaView>
    </ScrollToTop>
  );
}

export default SearchFighters;
