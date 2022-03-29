import React, { useCallback, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Animated } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import { emitter, EMITTER_EVENTS } from 'services/emitter.service';

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
  comment,
  onDelete,
  onReply,
}) {
  const { showFailure, showSuccess } = useToast();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const userId = useSelector(userSelectors.getUserId);
  const isAuthor = comment.author._id === userId;

  const commentRef = useRef(null);

  const [isActionsOpened, setIsActionsOpened] = useState(false);
  const [likedUsersState, setLikedUsersState] = useState(comment.likedUsers);
  const isLiked = likedUsersState.some(like => like._id === userId);
  const [isLikeDisabled, setIsLikeDisabled] = useState(false);

  const animation = useRef(new Animated.Value(0));

  useEffect(() => {
    const onHighlightComment = ({ commentId }) => {
      if (comment._id !== commentId) return;

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
        5000,
      );
    };

    emitter.on(EMITTER_EVENTS.HIGHLIGHT_COMMENT, onHighlightComment);

    return () => emitter.off(EMITTER_EVENTS.HIGHLIGHT_COMMENT, onHighlightComment);
  }, [comment._id]);

  const onChooseCommentAction = useCallback(() => {
    setIsActionsOpened(true);
  }, []);

  const onCloseCommentAction = useCallback(() => {
    setIsActionsOpened(false);
  }, []);

  const onDeleteComment = useCallback(async () => {
    setIsActionsOpened(false);
    try {
      const c = await commentApi.deleteComment(comment._id);
      showSuccess(t('Comment.commentDeleted'));
      onDelete(c);
    } catch (error) {
      showFailure();
    }
  }, [comment._id, onDelete, showFailure, showSuccess, t]);

  const onReportComment = useCallback(async () => {
    setIsActionsOpened(false);
    navigation.navigate('ReportComment', { commentId: comment._id, postId: comment.post._id });
  }, [navigation, comment._id, comment.post._id]);

  const onLikePress = useCallback(async () => {
    setIsLikeDisabled(true);
    try {
      const toggleLike = isLiked ? commentApi.removeLikeFromComment : commentApi.likeComment;
      const { likedUsers } = await toggleLike(comment._id);

      setLikedUsersState(likedUsers);
    } catch (error) {
      showFailure();
    }
    setIsLikeDisabled(false);
  }, [isLiked, comment._id, showFailure]);

  const onSeeLikes = useCallback(() => {
    navigation.navigate('LikesList', { commentId: comment._id, likedUsers: likedUsersState });
  }, [comment._id, likedUsersState, navigation]);

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
      key={comment._id}
    >
      <View
        style={[styles.commentLine, styles.firstLine]}
      >
        <View style={styles.fullNameContainer}>
          <Text style={styles.fullNameText}>{comment.targetComment?.authorName
            ? `${comment.author.fullName} ▸ ${comment.targetComment?.authorName}`
            : comment.author.fullName}
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
        <Text style={styles.commentText}>{comment.text}</Text>
      </View>
      <View style={styles.commentLine}>
        <View style={styles.dateContainer}>
          <Text style={[styles.secondaryText, styles.date]}>{formatTime(comment.createdOn)}</Text>
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
  comment: PropTypes.shape({
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
};

MainComment.defaultProps = {
  onDelete: () => null,
  onReply: () => null,
};

export default React.memo(MainComment);
