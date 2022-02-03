import React, { useCallback, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  View, Modal, TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import * as userSelectors from 'resources/user/user.selectors';

import * as commentApi from 'resources/comment/comment.api';

import EllipsisIcon from 'assets/icons/ellipsis';
import LikeIcon from 'assets/icons/like';

import Text from 'components/Text';

import useToast from 'hooks/useToast';
import { formatCount, formatTime } from 'components/Post/Post.helpers';

import colors from 'themes/colors';
import styles from './styles';

function Comment({
  data,
  onDelete,
}) {
  const { showFailure, showSuccess } = useToast();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const userId = useSelector(userSelectors.getUserId);
  const isAuthor = data.author._id === userId;

  const commentRef = useRef(null);

  const [isActionsOpened, setIsActionsOpened] = useState(false);
  const [actionsPositionY, setActionsPositionY] = useState(null);
  const [likedUsersState, setLikedUsersState] = useState(data.likedUsers);
  const isLiked = likedUsersState.some(like => like._id === userId);

  const onChooseCommentAction = useCallback(() => {
    if (!isActionsOpened && commentRef) {
      commentRef.current.measure((ox, oy, width, height, px, py) => setActionsPositionY(py));
    }
    setIsActionsOpened(!isActionsOpened);
  }, [isActionsOpened]);

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
    try {
      const toggleLike = isLiked ? commentApi.removeLikeFromComment : commentApi.likeComment;
      const { likedUsers } = await toggleLike(data._id);

      setLikedUsersState(likedUsers);
    } catch (error) {
      showFailure();
    }
  }, [isLiked, data._id, showFailure]);

  const onSeeLikes = useCallback(() => {
    navigation.navigate('LikesList', { commentId: data._id, likedUsers: likedUsersState });
  }, [data._id, likedUsersState, navigation]);


  return (
    <View
      style={styles.commentContainer}
      ref={commentRef}
      renderToHardwareTextureAndroid
      key={data._id}
    >
      <View
        style={[styles.commentLine, styles.firstLine]}
      >
        <View style={styles.fullNameContainer}>
          <Text style={styles.fullNameText}>{data.author.fullName}</Text>
          {isAuthor && <Text style={styles.youText}>{` (${t('Comment.you')})`}</Text>}
        </View>
        <View>
          <TouchableOpacity onPress={onChooseCommentAction} style={styles.dotButton}>
            <EllipsisIcon />
          </TouchableOpacity>
          {isActionsOpened && (
            <Modal
              transparent
              visible={isActionsOpened}
              animationType="fade"
              onRequestClose={() => {}}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={onCloseCommentAction}
                style={styles.closeModal}
              >
                <View
                  style={[
                    styles.actions,
                    actionsPositionY && { top: actionsPositionY + 30 },
                  ]}
                >
                  {isAuthor ? (
                    <TouchableOpacity style={styles.clickableArea} activeOpacity={0.7} onPress={onDeleteComment}>
                      <Text style={styles.actionsText}>
                        {t('Comment.deleteComment')}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={styles.clickableArea} activeOpacity={0.7} onPress={onReportComment}>
                      <Text style={styles.actionsText}>
                        {t('Comment.reportThisComment')}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            </Modal>
          )}
        </View>
      </View>
      <View>
        <Text style={styles.commentText}>{data.text}</Text>
      </View>
      <View style={styles.commentLine}>
        <View style={styles.fullNameContainer}>
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
        <TouchableOpacity onPress={onLikePress}>{isLiked ? (
          <LikeIcon
            stroke={colors.white}
            fill={colors.white}
          />
        ) : <LikeIcon stroke={colors.white} />}
        </TouchableOpacity>
      </View>
      <View style={styles.line} />
    </View>
  );
}

Comment.propTypes = {
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
    likedUsers: PropTypes.arrayOf(PropTypes.shape),
  }).isRequired,
  onDelete: PropTypes.func,
};

Comment.defaultProps = {
  onDelete: () => null,
};

export default React.memo(Comment);
