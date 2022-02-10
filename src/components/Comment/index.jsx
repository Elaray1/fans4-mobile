import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

import Text from 'components/Text';

import { emitter, EMITTER_EVENTS } from 'services/emitter.service';

import MainComment from './components/MainComment';

import styles from './styles';

const Comment = ({ item, onReply, onDelete }) => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onNewReply = (r) => {
      if (r.originalComment._id === item._id) {
        setIsOpen(true);
      }
    };

    emitter.on(EMITTER_EVENTS.NEW_REPLAY, onNewReply);
    return () => emitter.off(EMITTER_EVENTS.NEW_REPLAY, onNewReply);
  }, [item._id]);

  const onSeeMore = useCallback(() => setIsOpen(true), []);

  const repliesLength = item.replies?.length;

  return (
    <>
      <MainComment data={item} onDelete={onDelete} onReply={() => onReply(item)} />
      {!!repliesLength && (
        <View style={styles.repliesContainer}>
          {isOpen
            ? item.replies.map(i => <MainComment data={i} onDelete={onDelete} onReply={() => onReply(i)} />)
            : (
              <>
                <MainComment data={item.replies[0]} onDelete={onDelete} onReply={() => onReply(item.replies[0])} />
                {(repliesLength > 1) && (
                  <TouchableOpacity onPress={onSeeMore} style={styles.seeMoreButton}>
                    <Text style={styles.secondaryText}>
                      {t('Comments.see')}
                      {' '}
                      {repliesLength - 1}
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

Comment.propTypes = {
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

Comment.defaultProps = {
  onDelete: () => null,
  onReply: () => null,
};

export default React.memo(Comment);
