import React, { useCallback, useMemo } from 'react';
import {
  View, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import * as chatApi from 'resources/chat/chat.api';

import * as userSelectors from 'resources/user/user.selectors';

import Text from 'components/Text';

import { ACTIVITY_TYPES } from 'resources/activity/activity.constants';

import { formatTime } from 'components/Post/Post.helpers';
import { toFixLength } from 'helpers/modifyText';

import config from 'resources/config';

import styles from './styles';

function ActivityItem({ createdOn, type, data, title, showTime, isLast }) {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const userId = useSelector(userSelectors.getUserId);

  const onPressSayHi = useCallback(async () => {
    const chat = await chatApi.getChatByParticipantIds([data.author._id]);

    navigation.navigate('Chat', {
      chatId: chat._id,
      unreadMessagesCount: chat.participants.find(p => p._id === userId).unreadMessagesNumber,
      userFullName: data.author?.fullName,
    });
  }, [data.author?.fullName, navigation, data.author._id, userId]);

  const onCommentPress = useCallback(() => {
    navigation.navigate('Comments', { postId: data.post?._id });
  }, [data.post?._id, navigation]);

  const onPostPress = useCallback(() => {
    navigation.navigate('Account', { postId: data.post?._id });
  }, [data.post?._id, navigation]);

  const NewFanView = useCallback(() => (
    <View style={[styles.activityContainer, styles.alignItemsCenter]}>
      <View>
        <View style={styles.textContainer}>
          <Text style={styles.textBold}>{data.author.fullName} </Text>
          <Text style={[styles.text, styles.actionText]}>{t('ActivityItem.becameYourFan')}</Text>
        </View>
        {showTime && <Text style={styles.time}>{formatTime(createdOn)}</Text>}
      </View>
      <TouchableOpacity
        onPress={config.mode === 'PROD' ? () => {} : onPressSayHi}
        activeOpacity={0.7}
      >
        <Text style={styles.sayHi}>{t('ActivityItem.sayHi')}</Text>
      </TouchableOpacity>
    </View>
  ), [data.author.fullName, t, onPressSayHi, createdOn, showTime]);

  const NewPostCommentView = useCallback(() => (
    <TouchableOpacity
      onPress={onCommentPress}
      style={styles.activityContainer}
      activeOpacity={0.7}
    >
      <View>
        <View style={styles.textContainer}>
          <Text style={styles.textBold}>{data.author.fullName} </Text>
          <Text style={[styles.text, styles.actionText]}>{t('ActivityItem.commented')}</Text>
        </View>
        {data.comment.text && (
        <Text style={[styles.text, styles.commentText]}>
          {toFixLength({ text: data.comment.text, length: 110 })}
        </Text>
        )}
        {data.post.text && (
        <View style={styles.textPostContainer}>
          <Text style={styles.text}>{toFixLength({ text: data.post.text, length: 90 })}</Text>
          {data.post.media && (
          <FastImage
            style={styles.postImage}
            source={{ uri: data.post.media.posterStorageUrl || data.post.media.storageUrl }}
          />
          )}
        </View>
        )}
        {showTime && <Text style={[styles.time, styles.timeMargin]}>{formatTime(createdOn)}</Text>}
      </View>
      {!data.post.text && data.post.media && (
      <FastImage
        style={styles.postImage}
        source={{ uri: data.post.media.posterStorageUrl || data.post.media.storageUrl }}
      />
      )}
    </TouchableOpacity>
  ), [
    data.author.fullName, t, createdOn, showTime,
    data.post?.media, data.comment?.text,
    data.post?.text, onCommentPress,
  ]);

  const NewPostLikeView = useCallback(() => (
    <TouchableOpacity
      onPress={onPostPress}
      style={styles.activityContainer}
      activeOpacity={0.7}
    >
      <View>
        <View style={styles.textContainer}>
          <Text style={styles.textBold}>{data.author.fullName} </Text>
          <Text style={[styles.text, styles.actionText]}>{t('ActivityItem.likedYourPost')}</Text>
        </View>
        {data.post.text && (
        <View style={styles.textPostContainer}>
          <Text style={styles.text}>{toFixLength({ text: data.post.text, length: 100 })}</Text>
          {data.post.media && (
          <FastImage
            style={styles.postImage}
            source={{ uri: data.post.media.posterStorageUrl || data.post.media.storageUrl }}
          />
          )}
        </View>
        )}
        {showTime && <Text style={[styles.time, styles.timeMargin]}>{formatTime(createdOn)}</Text>}
      </View>
      {!data.post.text && data.post.media && (
      <FastImage
        style={styles.postImage}
        source={{ uri: data.post.media.posterStorageUrl || data.post.media.storageUrl }}
      />
      )}
    </TouchableOpacity>
  ), [
    data.author.fullName, t, createdOn, showTime,
    data.post?.media,
    data.post?.text,
    onPostPress,
  ]);


  const viewByType = useMemo(() => ({
    [ACTIVITY_TYPES.NEW_FAN]: NewFanView,
    [ACTIVITY_TYPES.NEW_POST_COMMENT]: NewPostCommentView,
    [ACTIVITY_TYPES.NEW_POST_LIKE]: NewPostLikeView,
  }), [NewFanView, NewPostCommentView, NewPostLikeView]);

  return (
    <View>
      {title && <Text style={styles.title}>{title}</Text>}
      {viewByType[type]()}
      <View style={[styles.line, isLast && styles.titleMargin]} />
    </View>
  );
}

ActivityItem.propTypes = {
  createdOn: PropTypes.string.isRequired,
  type: PropTypes.oneOf(Object.values(ACTIVITY_TYPES)).isRequired,
  data: PropTypes.shape().isRequired,
  title: PropTypes.string,
  showTime: PropTypes.bool,
  isLast: PropTypes.bool,
};

ActivityItem.defaultProps = {
  title: null,
  showTime: false,
  isLast: false,
};


export default React.memo(ActivityItem);
