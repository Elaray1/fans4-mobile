import React, { useEffect, useState, useCallback } from 'react';
import { View, SafeAreaView, FlatList, ActivityIndicator, ScrollView, RefreshControl, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import Text from 'components/Text';
import Header from 'components/Header';

import useToast from 'hooks/useToast';

import * as chatApi from 'resources/chat/chat.api';
import * as userSelectors from 'resources/user/user.selectors';
import { USER_TYPES } from 'resources/user/user.constants';

import NoFightsIllustration from 'assets/illustrations/no-events.svg';
import NewChatIcon from 'assets/icons/new-chat.svg';

import colors from 'themes/colors';

import ChatItem from './components/ChatItem';

import styles from './styles';

const INITIAL_PAGE = 1;
const PER_PAGE = 20;

const ChatsList = () => {
  const { t } = useTranslation();
  const { showFailure } = useToast();
  const navigation = useNavigation();

  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [page, setPage] = useState(INITIAL_PAGE);
  const [totalCount, setTotalCount] = useState(0);

  const userType = useSelector(userSelectors.getUserType);
  const isFan = userType === USER_TYPES.FAN;

  const keyExtractor = useCallback(item => item._id, []);

  const fans4 = chats.find(c => c.participants.find(p => p._id === 'fans4'));
  const filteredChats = chats.filter(c => !c.participants.some(p => p._id === 'fans4'));

  const EmptyView = () => (
    <View style={styles.emptyView}>
      <NoFightsIllustration style={styles.illustration} />
      <Text style={styles.titleText}>{t(isFan ? 'ChatsList.noSubscriptions' : 'ChatsList.startChatting')}</Text>
      <Text style={styles.text}>{t(isFan ? 'ChatsList.subscribe' : 'ChatsList.clickTheIcon')}</Text>
    </View>
  );

  const fetchChats = useCallback(async ({ refresh } = {}) => {
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
        } = await chatApi.getChatsList({
          page: INITIAL_PAGE,
          perPage: PER_PAGE,
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
      await fetchChats();
    };
    init();
  }, [fetchChats]);


  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchChats({ refresh: true });
    setIsRefreshing(false);
  }, [fetchChats]);

  const onNewMessages = useCallback(({ chat }) => {
    setChats((oldChats) => {
      const newChats = oldChats.filter(c => c._id !== chat._id);
      newChats.splice(1, 0, chat);
      return newChats;
    });
  }, []);

  const resetUnread = useCallback((chat) => {
    setChats(oldChats => oldChats.map(c => (c._id === chat._id ? chat : c)));
  }, []);

  const onNewChatPress = useCallback((chat) => {
    navigation.navigate('NewChat');
  }, [navigation]);

  const renderItem = ({ item }) => {
    return (
      <ChatItem chat={item} setNewChat={onNewMessages} resetUnread={resetUnread} />
    );
  };

  const Loader = () => <View style={styles.loader}><ActivityIndicator size="large" color={colors.primary} /></View>;

  const renderFooter = () => {
    if (!isLoading) {
      return null;
    }
    return <Loader />;
  };

  return (
    <SafeAreaView>
      <Header
        title={t('ChatsList.chats')}
        leftItemType={isFan ? null : 'backArrow'}
        rightItemType={isFan ? null : 'icon'}
        rightItemIcon={NewChatIcon}
        onRightItemPress={onNewChatPress}
      />
      <View style={styles.content}>
        {isRefreshing && <Loader />}
        {fans4 && renderItem({ item: fans4 })}
        {chats.length > (isFan ? 0 : 1) || page === INITIAL_PAGE
          ? (
            <FlatList
              style={styles.flatList}
              data={filteredChats}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              onEndReached={fetchChats}
              onEndReachedThreshold={0.3}
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
};

export default React.memo(ChatsList);
