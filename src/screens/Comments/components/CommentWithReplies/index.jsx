import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

import Comment from 'components/Comment';
import Text from 'components/Text';

import { emitter } from 'services/emitter.service';

import styles from './styles';

const CommentWithReplies = ({ item, onReply, onDelete }) => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onNewReply = (r) => {
      if (r.originalComment._id === item._id) {
        setIsOpen(true);
      }
    };
    emitter.on('new-reply', onNewReply);

    return () => emitter.off('new-reply', onNewReply);
  }, [item._id]);

  const onSeeMore = useCallback(() => setIsOpen(true), []);

  return (
    <>
      <Comment data={item} onDelete={onDelete} onReply={() => onReply(item)} />
      {!!item.replies?.length && (
        <View style={styles.repliesContainer}>
          {isOpen
            ? (
              <>
                {item.replies.map(i => <Comment data={i} onDelete={onDelete} onReply={() => onReply(i)} />)}
              </>
            ) : (
              <>
                <Comment data={item.replies[0]} onDelete={onDelete} onReply={() => onReply(item.replies[0])} />
                {(item.replies.length - 1 > 0) && (
                  <TouchableOpacity onPress={onSeeMore} style={styles.seeMoreButton}>
                    <Text style={styles.secondaryText}>
                      {t('Comments.see')}
                      {' '}
                      {item.replies.length - 1}
                      {' '}
                      {t('Comments.moreReplies')}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
        </View>
      )}
    </>
  );
};

export default React.memo(CommentWithReplies);

CommentWithReplies.propTypes = {
  item: PropTypes.shape({
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
  }).isRequired,
  onDelete: PropTypes.func,
  onReply: PropTypes.func,
};

CommentWithReplies.defaultProps = {
  onDelete: () => null,
  onReply: () => null,
};
