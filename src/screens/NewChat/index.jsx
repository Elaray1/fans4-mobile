import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import debounce from 'lodash.debounce';

import { useNavigation } from '@react-navigation/native';

import useToast from 'hooks/useToast';

import * as chatApi from 'resources/chat/chat.api';

import Header from 'components/Header';
import Text from 'components/Text';
import SearchInput from 'components/SearchInput';

import NoFightsIllustration from 'assets/illustrations/no-events.svg';

import colors from 'themes/colors';

import styles from './styles';

const INITIAL_PAGE = 1;
const PER_PAGE = 25;

function NewChat() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { showFailure } = useToast();


  const [page, setPage] = useState(INITIAL_PAGE);
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const [totalCount, setTotalCount] = useState(0);

  const fetchChats = useCallback(async ({ search = '', refresh } = {}) => {
    let fetchingPage = 1;

    if (!refresh) {
      fetchingPage = page;
    }

    if (fetchingPage === 1 || (chats.length < totalCount)) {
      setIsLoading(true);
      try {
        const {
          chats: fetchedChats,
          totalCount: fetchedTotalCount,
        } = await chatApi.getListOfFans({
          page: INITIAL_PAGE,
          perPage: PER_PAGE,
          ...(search && { search }),
        });

        setPage(fetchingPage + 1);
        setTotalCount(fetchedTotalCount);
        setChats(refresh ? fetchedChats : [...chats, ...fetchedChats]);
      } catch (error) {
        console.error(error);
        showFailure(t('Activity.couldntRefreshTheFeedPullToRefresh'));
      }
    }
    setIsLoading(false);
  }, [chats, page, showFailure, t, totalCount]);

  useEffect(() => {
    const init = async () => {
      await fetchChats({ refresh: true });
    };
    init();
  }, []);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchChats({ refresh: true });
    setIsRefreshing(false);
  }, [fetchChats]);


  const onSearchQueryChange = useRef(debounce(async (value) => {
    await fetchChats({ search: value, refresh: true });
  }, 500, { leading: false, trailing: true }));

  useEffect(() => {
    onSearchQueryChange.current(searchValue);
  }, [searchValue]);

  const keyExtractor = useCallback(item => item._id, []);

  const onChatPress = useCallback(async (id, name) => {
    navigation.navigate('Chat', {
      chatId: id,
      userFullName: name,
    });
  }, [navigation]);

  const onLinkPress = useCallback(() => {
    setSearchValue('');
  }, []);

  const renderItem = ({ item }) => {
    const { name: chatName } = item.participants;

    return (
      <TouchableOpacity style={styles.listItem} onPress={() => onChatPress(item._id, chatName)}>
        <Text style={styles.listItemCity}>{chatName}</Text>
      </TouchableOpacity>
    );
  };

  const Loader = () => <View style={styles.loader}><ActivityIndicator size="large" color={colors.primary} /></View>;

  const renderFooter = () => {
    if (!isLoading) {
      return null;
    }
    return <Loader />;
  };

  const EmptyView = () => (
    <>
      {searchValue ? (
        <View style={[styles.emptyView, styles.searchEmpty]}>
          <Text style={styles.titleText}>{t('NewChat.noSearchResults')}</Text>
          <TouchableOpacity style={styles.link} onPress={onLinkPress}>
            <Text style={styles.linkText}>{t('NewChat.showFullList')}</Text>
          </TouchableOpacity>
        </View>
      )
        : (
          <View style={styles.emptyView}>
            <NoFightsIllustration style={styles.illustration} />
            <Text style={styles.titleText}>{t('Fans.noFans')}</Text>
            <Text style={styles.text}>{t('Fans.nothingYet')}</Text>
          </View>
        )
      }
    </>
  );

  const renderItemSeparator = () => <View style={styles.line} />;

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />
      <Header
        title={t('NewChat.newChat')}
        leftItemType="backArrow"
      />
      <View style={styles.content}>
        <SearchInput
          value={searchValue}
          onChangeText={setSearchValue}
          placeholder={t('NewChat.search')}
        />
        {isRefreshing && <Loader />}
        {chats.length || page === INITIAL_PAGE
          ? (
            <FlatList
              style={styles.flatList}
              data={chats}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              onEndReached={fetchChats}
              onEndReachedThreshold={0.3}
              ItemSeparatorComponent={renderItemSeparator}
              onRefresh={onRefresh}
              ListFooterComponent={renderFooter}
              refreshing={isRefreshing}
              initialNumToRender={20}
            />
          )
          : (
            <ScrollView
              style={styles.flatList}
              contentContainerStyle={styles.emptyScroll}
              refreshControl={
                <RefreshControl refreshing={Platform.OS === 'ios' && isRefreshing} onRefresh={onRefresh} />
        }
              keyboardShouldPersistTaps="handled"
            >
              <EmptyView />
            </ScrollView>
          )
      }
      </View>
    </SafeAreaView>
  );
}

export default React.memo(NewChat);
