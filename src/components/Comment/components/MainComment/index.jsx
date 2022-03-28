import React, { useCallback, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Animated } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import * as userSelectors from 'resources/user/user.selectors';

import * as commentApi from 'resources/comment/comment.api';

import EllipsisIcon from 'assets/icons/ellipsis';
import LikeIcon from 'assets/icons/like';
import TrashIcon from 'assets/icons/trash';
import ReportIcon from 'assets/icons/report';

import Text from 'components/Text';

import useToast from 'hooks/useToast';
import { formatCount, formatTime } from 'components/Post/helpers';

import colors from 'themes/colors';
import EditCommentModal from '../EditCommentModal';

import styles from './styles';

function MainComment({
  data,
  onDelete,
  onReply,
  isTarget,
}) {
  const { showFailure, showSuccess } = useToast();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const userId = useSelector(userSelectors.getUserId);
  const isAuthor = data.author._id === userId;

  const commentRef = useRef(null);

  const [isActionsOpened, setIsActionsOpened] = useState(false);
  const [likedUsersState, setLikedUsersState] = useState(data.likedUsers);
  const isLiked = likedUsersState.some(like => like._id === userId);
  const [isLikeDisabled, setIsLikeDisabled] = useState(false);

  const animation = useRef(new Animated.Value(0));

  useEffect(() => {
    if (isTarget) {
      Animated.timing(animation.current, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();

      setTimeout(
        () => {
          Animated.timing(animation.current, {
            toValue: 0,
            duration: 800,
            useNativeDriver: false,
          }).start();
        },
        3000,
      );
    }
  }, [isTarget]);

  const onChooseCommentAction = useCallback(() => {
    setIsActionsOpened(true);
  }, []);

  const onCloseCommentAction = useCallback(() => {
    setIsActionsOpened(false);
  }, []);

  const onDeleteComment = useCallback(async () => {
    setIsActionsOpened(false);
    try {
      const comment = await commentApi.deleteComment(data._id);
      showSuccess(t('Comment.commentDeleted'));
      onDelete(comment);
    } catch (error) {
      showFailure();
    }
  }, [data._id, onDelete, showFailure, showSuccess, t]);

  const onReportComment = useCallback(async () => {
    setIsActionsOpened(false);
    navigation.navigate('ReportComment', { commentId: data._id, postId: data.post._id });
  }, [navigation, data._id, data.post._id]);

  const onLikePress = useCallback(async () => {
    setIsLikeDisabled(true);
    try {
      const toggleLike = isLiked ? commentApi.removeLikeFromComment : commentApi.likeComment;
      const { likedUsers } = await toggleLike(data._id);

      setLikedUsersState(likedUsers);
    } catch (error) {
      showFailure();
    }
    setIsLikeDisabled(false);
  }, [isLiked, data._id, showFailure]);

  const onSeeLikes = useCallback(() => {
    navigation.navigate('LikesList', { commentId: data._id, likedUsers: likedUsersState });
  }, [data._id, likedUsersState, navigation]);

  const backgroundColor = animation.current.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', '#1F1F24'],
  });

  return (
    <Animated.View
      style={{
        ...styles.commentContainer,
        backgroundColor,
      }}
      ref={commentRef}
      renderToHardwareTextureAndroid
      key={data._id}
    >
      <View
        style={[styles.commentLine, styles.firstLine]}
      >
        <View style={styles.fullNameContainer}>
          <Text style={styles.fullNameText}>{data.targetComment?.authorName
            ? `${data.author.fullName} ▸ ${data.targetComment?.authorName}`
            : data.author.fullName}
          </Text>
        </View>
        <View>
          <TouchableOpacity onPress={onChooseCommentAction} style={styles.dotButton}>
            <EllipsisIcon />
          </TouchableOpacity>

          <EditCommentModal
            onClose={onCloseCommentAction}
            visible={isActionsOpened}
            title={isAuthor ? t('Comment.deleteComment') : t('Comment.reportThisComment')}
            onEdit={isAuthor ? onDeleteComment : onReportComment}
            OptionIcon={isAuthor ? TrashIcon : ReportIcon}
          />

        </View>
      </View>
      <View>
        <Text style={styles.commentText}>{data.text}</Text>
      </View>
      <View style={styles.commentLine}>
        <View style={styles.dateContainer}>
          <Text style={[styles.secondaryText, styles.date]}>{formatTime(data.createdOn)}</Text>
          {!!likedUsersState.length
          && (
            <TouchableOpacity onPress={onSeeLikes}>
              <Text style={styles.secondaryText}>{formatCount(likedUsersState.length)}
                {' '}
                {t(likedUsersState.length === 1 ? 'Comment.like' : 'Comment.likes')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.dateContainer}>
          <TouchableOpacity onPress={onReply} style={styles.date}>
            <Text style={styles.secondaryText}>{t('Comment.reply')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onLikePress} disabled={isLikeDisabled}>{isLiked ? (
            <LikeIcon
              stroke={colors.white}
              fill={colors.white}
            />
          ) : <LikeIcon stroke={colors.white} />}
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.line} />
    </Animated.View>
  );
}

MainComment.propTypes = {
  data: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    author: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      fullName: PropTypes.string.isRequired,
    }),
    createdOn: PropTypes.string.isRequired,
    post: PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }),
    targetComment: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      authorName: PropTypes.string.isRequired,
    }),
    likedUsers: PropTypes.arrayOf(PropTypes.shape),
  }).isRequired,
  onDelete: PropTypes.func,
  onReply: PropTypes.func,
  isTarget: PropTypes.bool,
};

MainComment.defaultProps = {
  onDelete: () => null,
  onReply: () => null,
  isTarget: false,
};

export default React.memo(MainComment);
