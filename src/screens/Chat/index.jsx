import React, {
  useState, useCallback, useEffect, useMemo, useRef,
} from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView, View, FlatList, ActivityIndicator, ScrollView, RefreshControl, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import ErrorIcon from 'assets/icons/error.svg';

import * as userSelectors from 'resources/user/user.selectors';

import * as socketService from 'services/socket.service';

import * as messageApi from 'resources/message/message.api';
import * as messageActions from 'resources/message/message.actions';

import Header from 'components/Header';
import Text from 'components/Text';
import Input from 'components/Input';

import useToast from 'hooks/useToast';

import colors from 'themes/colors';

import NoMessagesIllustration from 'assets/illustrations/no-events.svg';

import { USER_TYPES } from 'resources/user/user.constants';
import { CLOSING_CHAT_REASONS } from 'resources/chat/chat.constants';


import Message from './Message';

import { addDateSepatorsToMessages, addUnreadMessagesLabel, getUnreadMessageId } from './Chat.helpers';

import styles from './styles';

const PER_PAGE_COUNT = 25;
const MESSAGE_MAX_LEGHT = 1000;

const keyboardAvoidingViewBehavior = Platform.OS === 'ios' ? 'padding' : 'height';
const keyboardVerticalOffset = Platform.OS === 'ios' ? 0 : 16;

function Chat({ route }) {
  const { t } = useTranslation();
  const { showFailure } = useToast();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const messagesListRef = useRef(null);

  const user = useSelector(userSelectors.getUserData);

  const {
    userId: otherUserId,
    userFullName: otherUserFullName,
    userAvatar: otherUserAvatar,
    chatId,
    unreadMessagesCount,
    onGoBack,
    closingReason,
  } = route?.params;

  const textByClosingReason = useMemo(() => (closingReason ? {
    [CLOSING_CHAT_REASONS.SUBSCRIPTION_IS_TERMINATED]: user.role.type === USER_TYPES.FIGHTER
      ? t('Chat.fighterSubscriptionEndText')
      : t('Chat.fanSubscriptionEndText'),
    [CLOSING_CHAT_REASONS.USER_IS_BLOCKED]: t('Chat.fighterIsBlocked'),
  } : null), [user.role.type, closingReason, t]);

  const [messages, setMessages] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [messageValue, setMessageValue] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFetchedFirstTime, setIsFetchedFirstTime] = useState(false);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(true);

  const [timeouts, setTimeouts] = useState([]);

  const [unreadLabelMessageId, setUnreadLabelMessageId] = useState(null);
  const [updatedMessages, setUpdatedMessages] = useState([]);

  const isMessageToBeScrolledRef = useRef(!!unreadMessagesCount);

  const messagesWithSeparators = useMemo(() => (messages.length === 1 && messages[0].isTyping
    ? messages
    : addDateSepatorsToMessages(messages)), [messages]);

  useEffect(() => {
    if (!unreadLabelMessageId && unreadMessagesCount && messages.length) {
      setUnreadLabelMessageId(getUnreadMessageId({ messages: messagesWithSeparators, userId: user._id }));
    }
  }, [messagesWithSeparators, user._id,
    unreadMessagesCount, unreadLabelMessageId,
    messages.length]);

  const messagesWithUnreadLabel = useMemo(() => (unreadLabelMessageId
    ? addUnreadMessagesLabel({
      messages: messagesWithSeparators,
      unreadLabelMessageId,
      unreadCount: unreadMessagesCount })
    : messagesWithSeparators),
  [messagesWithSeparators, unreadMessagesCount, unreadLabelMessageId]);

  const fetchNewItems = useCallback(async ({ refresh } = {}) => {
    let currentMessages = [];

    if (!refresh) {
      currentMessages = messages;
    }

    if (messages.length === 0 || currentMessages.length < totalCount) {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      try {
        const {
          messages: fetchedMessages,
          totalCount: fetchedTotalCount,
        } = await messageApi.getChatMessages({
          chatId,
          offset: currentMessages.length,
          perPage: unreadMessagesCount > PER_PAGE_COUNT ? unreadMessagesCount + 5 : PER_PAGE_COUNT,
        });
        setTotalCount(fetchedTotalCount);
        setMessages([...currentMessages, ...fetchedMessages]);
      } catch (error) {
        showFailure(t('Chat.couldntRefreshTheFeedPullToRefresh'));
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
  }, [messages, totalCount, showFailure, t, chatId, unreadMessagesCount, isFetchedFirstTime]);

  const onRefresh = useCallback(async () => {
    await fetchNewItems({ refresh: true });
  }, [fetchNewItems]);

  useEffect(() => {
    const fetchMessages = async () => {
      await fetchNewItems({ refresh: true });
    };

    fetchMessages();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const scrollToUnreadLabel = async () => {
      if (messagesListRef?.current && isMessageToBeScrolledRef.current) {
        const messageToScrollIndex = messagesWithUnreadLabel.findIndex(message => message.isNewMessagesLabel);
        if (messageToScrollIndex !== -1) {
          messagesListRef.current.scrollToIndex({
            index: messageToScrollIndex,
            viewPosition: 1,
            animated: false,
          });
        }
      }
    };

    scrollToUnreadLabel();
  }, [messagesWithUnreadLabel]);

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
    const newUpdatedMessages = [
      { isTyping: true, user: typingUser },
      ...oldMessages,
    ];
    setMessages(newUpdatedMessages);

    timeouts.forEach((timeoutId) => { clearTimeout(timeoutId); });
    const newTimeoutId = setTimeout(() => {
      removeTimeouts();
    }, 1000);
    setTimeouts([newTimeoutId]);
  }, [messages, timeouts, removeTimeouts]);

  useEffect(() => {
    socketService.on(`chat-${chatId}-message:created`, updateMessageList);
    socketService.on(`chat-${chatId}-typing`, onUserTyping);
    return () => {
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
    if (otherUserId === 'fans4') {
      navigation.navigate('Fans4Profile');
      return;
    }
    navigation.navigate('Fighter', { _id: otherUserId });
  }, [navigation, otherUserId]);

  const onViewableItemsChanged = useCallback(async ({ changed }) => {
    const readedMessagesIndexes = changed.filter(({ isViewable, item }) => {
      if (!item._id) {
        return false;
      }

      if (isViewable) {
        const isUserMessageUnread = item.participants.find(p => p._id === user._id).isUnread;

        if (isUserMessageUnread) {
          return true;
        }
      }

      return false;
    }).map(({ item }) => item._id);

    const newUpdatedMessages = await Promise.all(readedMessagesIndexes.map(async (messageId) => {
      const message = await messageApi.readMessage(messageId);

      dispatch(messageActions.removeUnreadMessage(messageId));
      return message;
    }));

    if (newUpdatedMessages.length) {
      setUpdatedMessages(newUpdatedMessages);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const viewConfigRef = useRef({
    viewAreaCoveragePercentThreshold: 50,
    waitForInteraction: !!unreadMessagesCount,
  });

  useEffect(() => {
    if (updatedMessages.length) {
      setMessages(messages
        .map((oldMessage) => {
          const updatedMessage = updatedMessages.find(message => message._id === oldMessage._id);

          return updatedMessage || oldMessage;
        }));
      setUpdatedMessages([]);
    }
  }, [updatedMessages, messages]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', onRefresh);
    return unsubscribe;
  }, [navigation, onRefresh]);

  const onBackNavigation = useCallback(() => {
    if (onGoBack) {
      onGoBack();
    }
    navigation.goBack();
  }, [navigation, onGoBack]);

  const EmptyView = () => (
    <View style={styles.emptyView}>
      <NoMessagesIllustration style={styles.illustration} />
      <Text style={styles.titleText}>{t('Chat.noMessagesHereYet')}</Text>
      <Text style={styles.text}>{t('Chat.sayHiToStartAConversation')}</Text>
    </View>
  );

  const keyExtractor = useCallback(item => item._id, []);

  const renderItem = ({ item }) => {
    if (item.isNewMessagesLabel) {
      return (
        <View style={styles.newMessageContainer}>
          <View style={styles.newMessage}>
            <Text key="newMessagesCount" style={styles.newMessagesText}>
              {`${item.unreadCount} ${item.unreadCount > 1 ? t('Chat.newMessages') : t('Chat.newMessage')}`}
            </Text>
          </View>
          <View style={styles.newMessagesLine} />
        </View>
      );
    }

    if (item.isTyping) {
      return (
        <Text key="typing" style={styles.typingMessage}>
          {`${otherUserFullName} is typing...`}
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

  const Loader = () => (
    <View style={[styles.loader, styles.contentMargin]}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  const renderFooter = () => {
    if (!isLoading) {
      return null;
    }
    return <Loader />;
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
            onLeftItemPress={onBackNavigation}
            rightItemType="image"
            {...(otherUserAvatar && {
              rightItemImageUrl: otherUserAvatar,
              onRightItemPress: onUserAvatarPress,
            })}
          />
          <View style={styles.content}>
            {!!messagesWithUnreadLabel.length && (
              <>
                <View style={!isMessageToBeScrolledRef.current && styles.hidden}>
                  <Loader />
                </View>
                <FlatList
                  ref={messagesListRef}
                  data={messagesWithUnreadLabel}
                  renderItem={renderItem}
                  keyExtractor={keyExtractor}
                  onEndReachedThreshold={0.3}
                  onEndReached={fetchNewItems}
                  showsVerticalScrollIndicator={false}
                  ListFooterComponent={renderFooter}
                  onRefresh={onRefresh}
                  refreshing={isRefreshing}
                  style={[styles.horizontalPaddings, isMessageToBeScrolledRef.current && styles.hidden]}
                  onViewableItemsChanged={onViewableItemsChanged}
                  viewabilityConfig={viewConfigRef.current}
                  onScrollToIndexFailed={(info) => {
                    const wait = new Promise(resolve => setTimeout(resolve, 500));
                    wait.then(() => {
                      messagesListRef.current?.scrollToIndex({ index: info.index, viewPosition: 1, animated: false });
                      setTimeout(() => {
                        isMessageToBeScrolledRef.current = false;
                        messagesListRef.current?.recordInteraction();
                      }, 300);
                    });
                  }}
                  inverted
                />
              </>
            )}

            {isFetchedFirstTime && !messagesWithUnreadLabel.length && (
              <ScrollView
                contentContainerStyle={styles.scrollView}
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
                keyboardShouldPersistTaps="handled"
                style={[styles.horizontalPaddings, styles.contentMargin]}
              >
                <EmptyView />
              </ScrollView>
            )}

            {!isFetchedFirstTime && isRefreshing && <Loader />}

            {isFetchedFirstTime && (
              <View style={styles.messageContainer}>
                <View style={styles.line} />
                <View style={styles.horizontalPaddings}>
                  {closingReason
                    ? (
                      <View style={styles.closingReasonContainer}>
                        <ErrorIcon style={styles.errorIcon} />
                        <Text style={styles.closingReasonText}>{textByClosingReason[closingReason]}</Text>
                      </View>
                    )
                    : (
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
                        buttonTitle={t('Chat.send')}
                        onButtonPress={onSendMessage}
                        disabled={isButtonDisabled}
                        autoFocus={isInputFocused}
                      />
                    )}
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
      unreadMessagesCount: PropTypes.number.isRequired,
      onGoBack: PropTypes.func,
    }),
  }).isRequired,
};

export default React.memo(Chat);
