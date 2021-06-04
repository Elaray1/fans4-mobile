import React, {
  useState, useCallback, useEffect, useRef,
} from 'react';
import {
  SafeAreaView, View, FlatList, TouchableOpacity, Image, ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import debounce from 'lodash.debounce';
import { useNavigation } from '@react-navigation/native';

import Header from 'components/Header';
import SearchInput from 'components/SearchInput';
import Text from 'components/Text';

import * as userApi from 'resources/user/user.api';

import { toFixLength } from 'helpers/modifyText';
import colors from 'themes/colors';

import styles from './SearchFighters.styles';

const PER_PAGE_COUNT = 20;

function SearchFighters() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [fighters, setFighters] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchNewItems = useCallback(async ({ search = '', refresh } = {}) => {
    let fetchingPage = 1;
    let currentFighters = [];

    if (!refresh) {
      fetchingPage = page;
      currentFighters = fighters;
    }

    if (page === 1 || fighters.length < totalCount) {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    }
  }, [fighters, page, totalCount]);

  const onSearchQueryChange = useRef(debounce(async (value) => {
    await fetchNewItems({ search: value, refresh: true });
  }, 500, { leading: false, trailing: true }));

  useEffect(() => {
    onSearchQueryChange.current(searchValue);
  }, [searchValue]);

  const onPressFighter = useCallback((fighterId) => {
    navigation.navigate('Fighter', { _id: fighterId });
  }, [navigation]);

  const renderItem = ({ item }) => {
    const { nickname } = item.role.biography;
    const { cityName, stateCode } = item.role.biography.hometown;

    return (
      <TouchableOpacity
        onPress={() => onPressFighter(item._id)}
      >
        <View style={styles.fighter}>
          <Image
            style={styles.fighterImage}
            source={{ uri: item.avatarUrl }}
          />
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

  return (
    <SafeAreaView style={styles.screen}>
      <Header
        title={t('SearchFighters.fighters')}
      />
      <View style={styles.content}>
        <SearchInput
          value={searchValue}
          onChangeText={setSearchValue}
          placeholder={t('SearchFighters.search')}
        />
        {!!fighters.length && (
        <FlatList
          data={fighters}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onEndReachedThreshold={0.3}
          onEndReached={fetchNewItems}
          style={styles.fightersList}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderFooter}
        />
        )}
      </View>
    </SafeAreaView>
  );
}

export default SearchFighters;
