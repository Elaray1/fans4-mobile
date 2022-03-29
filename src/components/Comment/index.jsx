import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

import Text from 'components/Text';

import MainComment from './components/MainComment';

import styles from './styles';

const Comment = ({ comment, originalComment, onReply, onDelete, onShowMoreReplies }) => {
  const { t } = useTranslation();

  const isReply = originalComment;

  const showButton = isReply
    && originalComment.replies[0]._id === comment._id
    && originalComment.replies.length > 1
    && !originalComment.areRepliesShown;

  return (
    <View style={isReply && styles.repliesContainer}>
      <MainComment
        comment={comment}
        onDelete={onDelete}
        onReply={() => onReply(comment)}
      />

      {showButton && (
        <TouchableOpacity
          onPress={() => onShowMoreReplies(originalComment._id)}
          style={styles.seeMoreButton}
        >
          <Text style={styles.secondaryText}>
            {t('Comments.see')}
            {' '}
            {originalComment.replies?.length - 1}
            {' '}
            {t('Comments.moreReplies')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const CommentType = PropTypes.shape({
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
  replies: PropTypes.arrayOf(PropTypes.shape),
  areRepliesShown: PropTypes.bool,
});

Comment.propTypes = {
  comment: CommentType.isRequired,
  originalComment: CommentType,
  onDelete: PropTypes.func,
  onReply: PropTypes.func,
  onShowMoreReplies: PropTypes.func.isRequired,
};

Comment.defaultProps = {
  originalComment: null,
  onDelete: () => null,
  onReply: () => null,
};

export default React.memo(Comment);
