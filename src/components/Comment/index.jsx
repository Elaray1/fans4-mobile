import React, { useCallback, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  View, Modal, TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import * as userSelectors from 'resources/user/user.selectors';

import * as commentApi from 'resources/comment/comment.api';

import EllipsisIcon from 'assets/icons/ellipsis';

import Text from 'components/Text';

import useToast from 'hooks/useToast';
import { formatTime } from 'components/Post/Post.helpers';

import styles from './styles';

function Comment({
  data,
  onDelete,
}) {
  const { showFailure, showSuccess } = useToast();
  const { t } = useTranslation();

  const userId = useSelector(userSelectors.getUserId);
  const isAuthor = data.author._id === userId;

  const commentRef = useRef(null);

  const [isActionsOpened, setIsActionsOpened] = useState(false);
  const [actionsPositionY, setActionsPositionY] = useState(null);

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
          <EllipsisIcon onPress={onChooseCommentAction} />
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
                  {isAuthor && (
                  <Text style={styles.actionsText} onPress={onDeleteComment}>
                    {t('Comment.deleteComment')}
                  </Text>
                  )}
                </View>
              </TouchableOpacity>
            </Modal>
          )}
        </View>
      </View>
      <View style={styles.commentLine}>
        <Text style={styles.secondaryText}>{data.text}</Text>
        <Text style={[styles.secondaryText, styles.date]}>{formatTime(data.createdOn)}</Text>
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
  }).isRequired,
  onDelete: PropTypes.func,
};

Comment.defaultProps = {
  onDelete: () => null,
};

export default React.memo(Comment);
