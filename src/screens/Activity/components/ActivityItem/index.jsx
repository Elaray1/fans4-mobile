/* eslint-disable react-native/no-raw-text */
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
import { USER_TYPES } from 'resources/user/user.constants';

import { formatTime } from 'components/Post/helpers';
import { toFixLength } from 'helpers/modifyText';

import styles from './styles';

function ActivityItem({ createdOn, type, data, title, showTime, isLast, isGroupped }) {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const userId = useSelector(userSelectors.getUserId);
  const userType = useSelector(userSelectors.getUserType);

  const isFan = userType === USER_TYPES.FAN;

  const onPressSayHi = useCallback(async () => {
    const chat = await chatApi.getChatByParticipantIds([data.author._id]);

    navigation.navigate('Chat', {
      chatId: chat._id,
      unreadMessagesCount: chat.participants.find(p => p._id === userId).unreadMessagesNumber,
      userFullName: data.author?.fullName,
    });
  }, [data.author?.fullName, navigation, data.author?._id, userId]);

  const onCommentPress = useCallback(() => {
    const postId = isGroupped ? data[0].post?._id : data.post?._id;
    const commentId = isGroupped ? data[0].comment?._id : data.comment?._id;

    navigation.navigate('Comments', { postId, commentId });
  }, [data, navigation, isGroupped]);

  const onPostPress = useCallback(() => {
    const postId = isGroupped ? data[0].post?._id : data.post?._id;

    navigation.navigate('Account', { postId });
  }, [data, navigation, isGroupped]);

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
        onPress={onPressSayHi}
        activeOpacity={0.7}
      >
        <Text style={styles.sayHi}>{t('ActivityItem.sayHi')}</Text>
      </TouchableOpacity>
    </View>
  ), [data.author?.fullName, t, onPressSayHi, createdOn, showTime]);

  const NewReplyView = useCallback(() => {
    return (
      <TouchableOpacity
        onPress={onCommentPress}
        style={styles.activityContainer}
        activeOpacity={0.7}
      >
        <View style={styles.newReplyContainer}>
          <View>
            <View style={styles.textContainer}>
              <Text style={styles.textBold}>{data.author.fullName}
                {' '}
                <Text style={[styles.text, styles.actionText]}>{t('ActivityItem.replied')}</Text>
              </Text>
            </View>
            {data.reply.text && (
              <Text style={[styles.whiteText, styles.commentText]}>
                {toFixLength({ text: data.reply.text, length: 110 })}
              </Text>
            )}
            {data.reply.targetComment.text && !data.post.media && (
              <View style={styles.dash}>
                <Text style={styles.text}>
                  {toFixLength({ text: data.reply.targetComment.text, length: 110 })}
                </Text>
              </View>
            )}
            {showTime && <Text style={[styles.time, styles.timeMargin]}>{formatTime(createdOn)}</Text>}
          </View>
          {data.post.media && (
            <FastImage
              style={styles.postImage}
              source={{ uri: data.post.media.posterStorageUrl || data.post.media.storageUrl }}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  }, [onCommentPress, data.author?.fullName, data.reply?.text, data.reply?.targetComment?.text,
    data.post?.media, t, showTime, createdOn]);

  const NewPostCommentView = useCallback(() => (
    <TouchableOpacity
      onPress={onCommentPress}
      style={styles.activityContainer}
      activeOpacity={0.7}
    >
      <View>
        <View style={styles.textContainer}>
          <Text style={styles.textBold}>{data.author.fullName}
            {' '}
            <Text style={[styles.text, styles.actionText]}>{
          isFan
            ? `${t('ActivityItem.commentedOn')} ${data.post.author.fullName} ${t('ActivityItem.post')}`
            : t('ActivityItem.commented')
          }
            </Text>
          </Text>
        </View>
        {data.comment.text && (
          <Text style={[styles.whiteText, styles.commentText]}>
            {toFixLength({ text: data.comment.text, length: 110 })}
          </Text>
        )}
        {data.post.text && !data.post.media && (
          <View style={styles.dash}>
            <Text style={styles.text}>
              {toFixLength({ text: data.post.text, length: 100 })}
            </Text>
          </View>
        )}
        {showTime && <Text style={[styles.time, styles.timeMargin]}>{formatTime(createdOn)}</Text>}
      </View>
      {data.post.media && (
        <FastImage
          style={styles.postImage}
          source={{ uri: data.post.media.posterStorageUrl || data.post.media.storageUrl }}
        />
      )}
    </TouchableOpacity>
  ), [onCommentPress, data.author?.fullName, data.post?.author?.fullName,
    data.post?.text, data.post?.media, data.comment?.text, isFan, t, showTime, createdOn]);

  const NewPostLikeView = useCallback(() => {
    const { post } = isGroupped ? data[0] : data;

    let activityTitleText = null;
    if (isGroupped) {
      if (data.length === 2) {
        activityTitleText = (
          <>
            <Text style={styles.textBold}>{data[0].author.fullName} </Text>
            <Text style={styles.textBold}>{t('ActivityItem.and')} </Text>
            <Text style={styles.textBold}>{data[1].author.fullName} </Text>
            <Text style={[styles.text, styles.actionText]}>{t('ActivityItem.likedYourPost')}</Text>
          </>
        );
      } else {
        activityTitleText = (
          <>
            <Text style={styles.textBold}>{data[0].author.fullName} </Text>
            <Text style={styles.textBold}>{t('ActivityItem.and')} </Text>
            <Text style={styles.textBold}>{data.length - 1} </Text>
            <Text style={styles.textBold}>{t('ActivityItem.others')} </Text>
            <Text style={[styles.text, styles.actionText]}>{t('ActivityItem.likedYourPost')}</Text>
          </>
        );
      }
    } else {
      activityTitleText = (
        <>
          <Text style={styles.textBold}>{data.author.fullName}
            {' '}
            <Text style={[styles.text, styles.actionText]}>{t('ActivityItem.likedYourPost')}</Text>
          </Text>
        </>
      );
    }

    return (
      <TouchableOpacity
        onPress={onPostPress}
        style={styles.activityContainer}
        activeOpacity={0.7}
      >
        <View>
          <View style={styles.textContainer}>
            {activityTitleText}
          </View>
          {post.text && !post.media && (
            <View style={styles.dash}>
              <Text style={styles.text}>
                {toFixLength({ text: post.text, length: 100 })}
              </Text>
            </View>
          )}
          {showTime && <Text style={[styles.time, styles.timeMargin]}>{formatTime(createdOn)}</Text>}
        </View>
        {post.media && (
          <FastImage
            style={styles.postImage}
            source={{ uri: post.media.posterStorageUrl || post.media.storageUrl }}
          />
        )}
      </TouchableOpacity>
    );
  }, [data, createdOn, isGroupped,
    showTime, t, onPostPress]);

  const newCommentLikeView = useCallback(() => (
    <TouchableOpacity
      onPress={onCommentPress}
      style={styles.activityContainer}
      activeOpacity={0.7}
    >
      <View>
        <View style={styles.textContainer}>
          <Text style={styles.textBold}>{data.author.fullName}
            {' '}
            <Text style={[styles.text, styles.actionText]}>
              {t('ActivityItem.likedYour')} {t(data.comment.isReply ? 'ActivityItem.reply' : 'ActivityItem.comment')}:
            </Text>
          </Text>
        </View>
        {data.comment.text && (
          <Text style={[styles.whiteText, styles.commentText]}>
            {toFixLength({ text: data.comment.text, length: 110 })}
          </Text>
        )}
        {showTime && <Text style={[styles.time, styles.timeMargin]}>{formatTime(createdOn)}</Text>}
      </View>
    </TouchableOpacity>
  ), [createdOn, data.author?.fullName, data.comment?.isReply, data.comment?.text, onCommentPress, showTime, t]);

  const viewByType = useMemo(() => ({
    [ACTIVITY_TYPES.NEW_FAN]: NewFanView,
    [ACTIVITY_TYPES.NEW_POST_COMMENT]: NewPostCommentView,
    [ACTIVITY_TYPES.NEW_POST_LIKE]: NewPostLikeView,
    [ACTIVITY_TYPES.NEW_REPLY]: NewReplyView,
    [ACTIVITY_TYPES.NEW_COMMENT_LIKE]: newCommentLikeView,
  }), [NewFanView, NewPostCommentView, NewPostLikeView, NewReplyView, newCommentLikeView]);

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
  isGroupped: PropTypes.bool,
};

ActivityItem.defaultProps = {
  title: null,
  showTime: false,
  isLast: false,
  isGroupped: false,
};


export default React.memo(ActivityItem);
