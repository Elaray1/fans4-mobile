import React, {
  useState, useCallback, useEffect, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView, View, FlatList, ActivityIndicator, ScrollView, RefreshControl, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import * as userSelectors from 'resources/user/user.selectors';

import * as socketService from 'services/socket.service';

import * as messageApi from 'resources/message/message.api';

import Header from 'components/Header';
import Text from 'components/Text';
import Input from 'components/Input';

import useToast from 'hooks/useToast';

import colors from 'themes/colors';

import NoMessagesIllustration from 'assets/illustrations/no-events.svg';

import Message from './Message';

import { addDateSepatorsToMessages } from './Chat.helpers';

import styles from './styles';

const PER_PAGE_COUNT = 25;
const MESSAGE_MAX_LEGHT = 1000;

const keyboardAvoidingViewBehavior = Platform.OS === 'ios' ? 'padding' : 'height';
const keyboardVerticalOffset = Platform.OS === 'ios' ? 0 : 16;

function Chat({ route }) {
  const { t } = useTranslation();
  const { showFailure } = useToast();
  const navigation = useNavigation();

  const userId = useSelector(userSelectors.getUserId);

  const {
    userId: otherUserId,
    userFullName: otherUserFullName,
    userAvatar: otherUserAvatar,
    chatId,
  } = route?.params;

  const [messages, setMessages] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [messageValue, setMessageValue] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(true);

  const messagesWithSeparators = useMemo(() => addDateSepatorsToMessages(messages), [messages]);

  const fetchNewItems = useCallback(async ({ refresh } = {}) => {
    let fetchingPage = 1;
    let currentMessages = [];

    if (!refresh) {
      fetchingPage = page;
      currentMessages = messages;
    } else {
      setIsRefreshing(true);
    }

    if (fetchingPage === 1 || currentMessages.length < totalCount) {
      setIsLoading(true);
      try {
        const {
          messages: fetchedMessages,
          totalCount: fetchedTotalCount,
        } = await messageApi.getChatMessages({
          chatId,
          page: fetchingPage,
          perPage: PER_PAGE_COUNT,
        });
        setTotalCount(fetchedTotalCount);
        setMessages([...currentMessages, ...fetchedMessages]);
        setPage(fetchingPage + 1);
      } catch (error) {
        showFailure(t('Chat.couldntRefreshTheFeedPullToRefresh'));
      }
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [messages, page, totalCount, showFailure, t, chatId]);

  const onRefresh = useCallback(async () => {
    await fetchNewItems({ refresh: true });
  }, [fetchNewItems]);

  useEffect(() => {
    const fetchComments = async () => {
      await fetchNewItems({ refresh: true });
    };

    fetchComments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateMessageList = useCallback((newMessage) => {
    if (!messages.find(message => message._id === newMessage._id)) {
      setMessages([newMessage, ...messages]);
    }
  }, [messages]);

  useEffect(() => {
    socketService.emit('subscribe', `chat-${chatId}`);
    socketService.on('message:created', updateMessageList);
    return () => {
      socketService.emit('unsubscribe', `chat-${chatId}`);
      socketService.removeListener('message:created', updateMessageList);
    };
  }, [updateMessageList, chatId]);

  const onInputFocus = useCallback(() => {
    setIsInputFocused(true);
  }, []);

  const onInputBlur = useCallback(() => {
    setIsInputFocused(false);
  }, []);

  const onSendMessage = useCallback(async () => {
    setIsButtonDisabled(true);
    try {
      const message = await messageApi.sendMessage({
        text: messageValue,
        chatId,
      });
      setMessageValue('');
      setMessages([message, ...messages]);
    } catch (error) {
      showFailure(t('Chat.messageNotSentPleaseTryAgain'));
    }
    setIsButtonDisabled(false);
  }, [messages, showFailure, t, messageValue, chatId]);

  const onUserAvatarPress = useCallback(() => {
    navigation.navigate('Fighter', { _id: otherUserId });
  }, [navigation, otherUserId]);

  const EmptyView = () => (
    <View style={styles.emptyView}>
      <NoMessagesIllustration style={styles.illustration} />
      <Text style={styles.titleText}>{t('Chat.noMessagesHereYet')}</Text>
      <Text style={styles.text}>{t('Chat.sayHiToStartAConversation')}</Text>
    </View>
  );

  const keyExtractor = useCallback(item => item._id, []);

  const renderItem = ({ item }) => {
    if (item.isDateSeparator) {
      return (
        <Text style={styles.dateSeparator}>{item.text}</Text>
      );
    }

    return (
      <Message
        key={item._id}
        text={item.text}
        time={item.createdOn}
        isSender={item.sender._id === userId}
      />
    );
  };

  const Loader = () => <View style={styles.loader}><ActivityIndicator size="large" color={colors.primary} /></View>;

  const renderFooter = () => {
    if (!isLoading) {
      return null;
    }
    return <Loader />;
  };

  const renderList = () => {
    if (isRefreshing) {
      return <Loader />;
    }

    if (!messages.length) {
      return (
        <ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
          keyboardShouldPersistTaps="handled"
          style={styles.horizontalPaddings}
        >
          <EmptyView />
        </ScrollView>
      );
    }

    return (
      <FlatList
        data={messagesWithSeparators}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReachedThreshold={0.3}
        onEndReached={fetchNewItems}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderFooter}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
        style={styles.horizontalPaddings}
        inverted
      />
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={keyboardAvoidingViewBehavior}
        style={styles.keyboardAvoiding}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <View style={styles.keyboardAvoidingChildContainer}>
          <Header
            title={otherUserFullName}
            leftItemType="backArrow"
            rightItemType="image"
            {...(otherUserAvatar && {
              rightItemImageUrl: otherUserAvatar,
              onRightItemPress: onUserAvatarPress,
            })}
          />
          <View style={styles.content}>
            {renderList()}

            {!isRefreshing && (
              <View style={styles.messageContainer}>
                <View style={styles.line} />
                <View style={styles.horizontalPaddings}>
                  <Input
                    value={messageValue}
                    onChange={setMessageValue}
                    onFocus={onInputFocus}
                    onBlur={onInputBlur}
                    placeholder={t('Chat.typeAMessage')}
                    maxLength={MESSAGE_MAX_LEGHT}
                    multiline
                    multilineSmall
                    autogrowHeight
                    style={styles.input}
                    multilineStyle={styles.multiline}
                    buttonTitle={t('Chat.post')}
                    onButtonPress={onSendMessage}
                    disabled={isButtonDisabled}
                    autoFocus={isInputFocused}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

Chat.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      userId: PropTypes.string,
      userFullName: PropTypes.string.isRequired,
      userAvatar: PropTypes.string,
      chatId: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export default React.memo(Chat);
