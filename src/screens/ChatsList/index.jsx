import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, SafeAreaView, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigation, useScrollToTop } from '@react-navigation/native';

import Text from 'components/Text';
import Header from 'components/Header';
import CustomRefreshControl from 'components/CustomRefreshControl';

import useToast from 'hooks/useToast';

import * as chatApi from 'resources/chat/chat.api';

import * as userSelectors from 'resources/user/user.selectors';

import { FANS4_ACCOUNT } from 'helpers/constants';
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

  const userType = useSelector(userSelectors.getUserType);

  const listRef = useRef(null);
  useScrollToTop(listRef);

  const [chats, setChats] = useState([]);
  const [page, setPage] = useState(INITIAL_PAGE);
  const [totalCount, setTotalCount] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFetchedFirstTime, setIsFetchedFirstTime] = useState(false);

  const isFan = userType === USER_TYPES.FAN;

  const keyExtractor = useCallback(item => item._id, []);

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
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      try {
        if (fetchingPage === 1 && !isFan) {
          const [chatWithFans4, { chats: fetchedChats, totalCount: fetchedTotalCount }] = await Promise.all([
            chatApi.getChatWithFans4(),
            chatApi.getChatsList({
              page: INITIAL_PAGE,
              perPage: PER_PAGE,
            }),
          ]);

          setPage(fetchingPage + 1);
          setTotalCount(fetchedTotalCount);
          setChats([chatWithFans4, ...fetchedChats]);
        } else {
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
        }
      } catch (error) {
        console.error(error);
        showFailure(t('Activity.couldntRefreshTheFeedPullToRefresh'));
      }
    }

    if (!isFetchedFirstTime) {
      setIsFetchedFirstTime(true);
    }

    if (refresh) {
      setIsRefreshing(false);
    } else {
      setIsLoading(false);
    }
  }, [chats, totalCount, isFetchedFirstTime, page, isFan, showFailure, t]);

  useEffect(() => {
    const init = async () => {
      await fetchChats({ refresh: true });
    };
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = useCallback(async () => {
    await fetchChats({ refresh: true });
  }, [fetchChats]);

  const onNewMessages = useCallback(({ chat }) => {
    setChats((oldChats) => {
      const newChats = oldChats.filter(c => c._id !== chat._id);
      newChats.splice(isFan || chat._id === FANS4_ACCOUNT._id ? 0 : 1, 0, chat);
      return newChats;
    });
  }, [isFan]);

  const onNewChatPress = useCallback((chat) => {
    navigation.navigate('NewChat', { onRefreshChatsList: onRefresh });
  }, [navigation, onRefresh]);

  const renderItem = ({ item }) => {
    return (
      <ChatItem chat={item} setNewChat={onNewMessages} onRefreshChats={onRefresh} />
    );
  };

  const Loader = () => <View style={styles.loader}><ActivityIndicator size="large" color={colors.primary} /></View>;

  const renderFooter = () => {
    if (!isLoading) {
      return null;
    }
    return <Loader />;
  };

  const RefreshControl = (
    <CustomRefreshControl
      refreshing={isRefreshing}
      onRefresh={onRefresh}
    />
  );

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
        {!isFetchedFirstTime && isRefreshing && <Loader />}

        {chats.length > (isFan ? 0 : 1)
          && (
            <FlatList
              ref={listRef}
              style={styles.flatList}
              data={chats}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              onEndReached={fetchChats}
              onEndReachedThreshold={0.3}
              onRefresh={onRefresh}
              ListFooterComponent={renderFooter}
              refreshing={isRefreshing}
              refreshControl={RefreshControl}
              initialNumToRender={20}
            />
          )}

        {isFetchedFirstTime && chats.length <= (isFan ? 0 : 1) && (
          <ScrollView
            style={styles.flatList}
            contentContainerStyle={styles.emptyScroll}
            refreshControl={RefreshControl}
            keyboardShouldPersistTaps="handled"
          >
            {!isFan && chats.length
            && <ChatItem chat={chats[0]} setNewChat={onNewMessages} onRefreshChats={onRefresh} />}
            <EmptyView />
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default React.memo(ChatsList);
