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

import * as socketService from 'services/socket.service';

import Text from 'components/Text';

import styles from './styles';

const ChatItem = ({ chat, setNewChat, resetUnread }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const userId = useSelector(userSelectors.getUserId);

  const { participants } = chat;

  const { unreadMessagesNumber } = participants.find(u => u._id === userId);
  const { name: chatName, avatarUrl, _id } = participants.find(u => u._id !== userId);

  useEffect(() => {
    socketService.emit('subscribe', `chat-${chat._id}`);
    socketService.on(`chat-${chat._id}-message:created`, setNewChat);
    return () => {
      socketService.emit('unsubscribe', `chat-${chat._id}`);
      socketService.removeListener(`chat-${chat._id}-message:created`, setNewChat);
    };
  }, [chat._id, setNewChat]);

  const onChatPress = useCallback(async () => {
    const newChat = Object.assign({}, chat);
    const index = participants.findIndex(u => u._id === userId);
    newChat.participants[index].unreadMessagesNumber = 0;
    resetUnread(newChat);
    navigation.navigate('Chat', {
      chatId: chat._id,
      userId: _id,
      userFullName: chatName,
      userAvatar: avatarUrl,
    });
  }, [chat, participants, resetUnread, navigation, _id, chatName, avatarUrl, userId]);

  return (
    <TouchableOpacity style={styles.chat} onPress={onChatPress}>
      {avatarUrl && <FastImage source={{ uri: avatarUrl }} style={styles.photoImage} />}
      <View style={styles.chatInfo}>
        <View style={[styles.row, styles.topRow]}>
          <Text style={styles.name}>{chatName}</Text>
          {chat?.lastMessage?.createdOn
         && <Text style={styles.time}>{formatTime(chat.lastMessage.createdOn)}</Text>}
        </View>
        <View style={styles.row}>
          {chat?.lastMessage?.text ? (
            <Text style={styles.message}>
              {toFixLength({ text: chat.lastMessage.text, length: 50 })}
            </Text>
          ) : <Text style={styles.text}>{`${t('ChatsList.startChattingWith')} ${chatName}`}</Text>}
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
  resetUnread: PropTypes.func.isRequired,
};

export default React.memo(ChatItem);
