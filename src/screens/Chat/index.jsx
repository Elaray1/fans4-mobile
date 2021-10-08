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

import * as chatApi from 'resources/chat/chat.api';

import Header from 'components/Header';
import Text from 'components/Text';
import Input from 'components/Input';

import useToast from 'hooks/useToast';

import colors from 'themes/colors';

import NoMessagesIllustration from 'assets/illustrations/no-events.svg';

import { USER_TYPES } from 'resources/user/user.constants';

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

  const user = useSelector(userSelectors.getUserData);

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

  const [timeouts, setTimeouts] = useState([]);

  const messagesWithSeparators = useMemo(() => (messages.length === 1 && messages[0].isTyping
    ? messages
    : addDateSepatorsToMessages(messages)), [messages]);

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
    const fetchMessages = async () => {
      await fetchNewItems({ refresh: true });
      await chatApi.readMessages({ _id: chatId });
    };

    fetchMessages();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateMessageList = useCallback(({ message: newMessage }) => {
    if (!messages.find(message => message._id === newMessage._id)) {
      if (messages[0]?.isTyping) {
        setMessages([messages[0], newMessage, ...messages.slice(1)]);
      } else {
        setMessages([newMessage, ...messages]);
      }
    }
  }, [messages]);

  const removeTimeouts = useCallback(() => {
    setTimeouts([]);
  }, []);

  useEffect(() => {
    if (!timeouts.length && messages.find(m => m.isTyping)) {
      setMessages(messages.filter(m => !m.isTyping));
    }
  }, [timeouts.length, messages]);

  const onUserTyping = useCallback(({ user: typingUser }) => {
    const oldMessages = messages[0]?.isTyping ? messages.slice(1) : messages;
    const updatedMessages = [
      { isTyping: true, user: typingUser },
      ...oldMessages,
    ];
    setMessages(updatedMessages);

    timeouts.forEach((timeoutId) => { clearTimeout(timeoutId); });
    const newTimeoutId = setTimeout(() => {
      removeTimeouts();
    }, 1000);
    setTimeouts([newTimeoutId]);
  }, [messages, timeouts, removeTimeouts]);

  useEffect(() => {
    socketService.emit('subscribe', `chat-${chatId}`);
    socketService.on(`chat-${chatId}-message:created`, updateMessageList);
    socketService.on(`chat-${chatId}-typing`, onUserTyping);
    return () => {
      socketService.emit('unsubscribe', `chat-${chatId}`);
      socketService.removeListener(`chat-${chatId}-message:created`, updateMessageList);
      socketService.removeListener(`chat-${chatId}-typing`, onUserTyping);
    };
  }, [updateMessageList, chatId, onUserTyping]);

  const onMessageTextChange = useCallback((messageText) => {
    setMessageValue(messageText);
    const name = user.role.type === USER_TYPES.FIGHTER ? user.fullName : user.role.biography.nickname;
    socketService.emit('emit', {
      roomId: `chat-${chatId}`,
      eventName: `chat-${chatId}-typing`,
      data: { user: { name } },
    });
  }, [chatId, user.role.type, user.fullName, user.role.biography.nickname]);

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
      if (messages[0]?.isTyping) {
        setMessages([messages[0], message, ...messages.slice(1)]);
      } else {
        setMessages([message, ...messages]);
      }
    } catch (error) {
      showFailure(t('Chat.messageNotSentPleaseTryAgain'));
    }
    setIsButtonDisabled(false);
  }, [messages, showFailure, t, messageValue, chatId]);

  const onUserAvatarPress = useCallback(() => {
    navigation.navigate('Fighter', { _id: otherUserId });
  }, [navigation, otherUserId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', onRefresh);
    return unsubscribe;
  }, [navigation, onRefresh]);

  const EmptyView = () => (
    <View style={styles.emptyView}>
      <NoMessagesIllustration style={styles.illustration} />
      <Text style={styles.titleText}>{t('Chat.noMessagesHereYet')}</Text>
      <Text style={styles.text}>{t('Chat.sayHiToStartAConversation')}</Text>
    </View>
  );

  const keyExtractor = useCallback(item => item._id, []);

  const renderItem = ({ item }) => {
    if (item.isTyping) {
      return (
        <Text key="typing" style={styles.typingMessage}>
          {`${item.user.name} is typing...`}
        </Text>
      );
    }

    if (item.isDateSeparator) {
      return (
        <Text key={item.text} style={styles.dateSeparator}>{item.text}</Text>
      );
    }

    return (
      <Message
        key={item._id}
        text={item.text}
        time={item.createdOn}
        isSender={item.sender._id === user._id}
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
                    onChange={onMessageTextChange}
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
