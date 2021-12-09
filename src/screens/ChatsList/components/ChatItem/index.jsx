import React, { useCallback, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';

import * as userSelectors from 'resources/user/user.selectors';

import { toFixLength } from 'helpers/modifyText';
import { formatTime } from 'components/Post/Post.helpers';
import { CHAT_STATUSES } from 'resources/chat/chat.constants';
import { USER_TYPES } from 'resources/user/user.constants';

import websocketsService from 'services/socket.service';

import Text from 'components/Text';

import styles from './styles';

const ChatItem = ({ chat, setNewChat, onRefreshChats }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const userId = useSelector(userSelectors.getUserId);
  const userType = useSelector(userSelectors.getUserType);

  const { participants, status } = chat;
  const isChatClosed = status === CHAT_STATUSES.CLOSED;

  const { unreadMessagesNumber } = participants.find(u => u._id === userId);
  const { name: chatName, avatarUrl, _id } = participants.find(u => u._id !== userId);
  const isFans4 = _id === 'fans4';

  useEffect(() => {
    websocketsService.emit('subscribe', `chat-${chat._id}`);
    websocketsService.on(`chat-${chat._id}-message:created`, setNewChat);
    return () => {
      websocketsService.emit('unsubscribe', `chat-${chat._id}`);
      websocketsService.off(`chat-${chat._id}-message:created`, setNewChat);
    };
  }, [chat._id, setNewChat]);

  const onChatPress = useCallback(async () => {
    navigation.navigate('Chat', {
      chatId: chat._id,
      userId: _id,
      userFullName: chatName,
      unreadMessagesCount: unreadMessagesNumber,
      userAvatar: avatarUrl,
      onGoBack: onRefreshChats,
      closingReason: chat.closingReason,
    });
  }, [chat, navigation, _id, chatName, avatarUrl, unreadMessagesNumber, onRefreshChats]);

  return (
    <TouchableOpacity style={isFans4 ? styles.fans4Chat : styles.chat} onPress={onChatPress}>
      {avatarUrl && (
      <FastImage
        source={{ uri: avatarUrl }}
        style={[
          isFans4 ? styles.fans4Photo : styles.photoImage,
          userType === USER_TYPES.FAN && isChatClosed && styles.opacityImage,
        ]}
      />
      )}
      <View style={styles.chatInfo}>
        <View style={[styles.row, styles.topRow]}>
          <Text style={[styles.name, isChatClosed && styles.closedChatText]}>
            { isFans4 ? `${chatName} Support` : chatName}
          </Text>
          {chat?.lastMessage?.createdOn && !isChatClosed
         && <Text style={styles.time}>{formatTime(chat.lastMessage.createdOn)}</Text>}
        </View>
        <View style={styles.row}>
          {chat?.lastMessage?.text ? (
            <Text style={[styles.message, isChatClosed && styles.closedChatText]}>
              {toFixLength({ text: chat.lastMessage.text, length: 50 })}
            </Text>
          ) : (
            <Text style={styles.text}>{`${t('ChatsList.startChattingWith')} ${isFans4
              ? `${chatName} Support`
              : chatName}`}
            </Text>
          )}
          {Boolean(unreadMessagesNumber) && (
          <View style={styles.counter}>
            <Text style={styles.counterText}>{unreadMessagesNumber}</Text>
          </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

ChatItem.propTypes = {
  chat: PropTypes.shape().isRequired,
  setNewChat: PropTypes.func.isRequired,
  onRefreshChats: PropTypes.func.isRequired,
};

export default React.memo(ChatItem);
