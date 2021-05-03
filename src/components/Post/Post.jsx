import React from 'react';
import { View, Image } from 'react-native';
import PropTypes from 'prop-types';

import { CONTENT_TYPES, POST_STATUSES } from 'resources/post/post.constants';

import Text from 'components/Text';
import StatusBadge from 'components/StatusBadge';

import LikeIcon from 'assets/icons/like';
import CommentIcon from 'assets/icons/comment';

import { formatCount, formatTime } from './Post.helpers';
import styles from './Post.styles';

function Post({
  description,
  type,
  contentUrl,
  avatarUrl,
  location,
  fullName,
  status,
  checkedOn,
}) {
  return (
    <View style={styles.post}>

      {avatarUrl && fullName && location && (
      <View>
        <Image
          style={styles.avatar}
          source={{ uri: avatarUrl }}
        />
        <View>
          <Text>
            {fullName}
          </Text>
          <Text>
            {location}
          </Text>
        </View>
      </View>
      )}

      <View>
        {contentUrl && (
          <Image
            style={{ width: '100%' }}
            source={{ uri: contentUrl }}
          />
        )}
        <Text style={styles.description}>{description}</Text>
      </View>

      {status === POST_STATUSES.APPROVED && (
        <View style={[styles.status, styles.approvedStatus]}>
          <View style={styles.postActions}>
            <View style={styles.postAction}>
              <LikeIcon />
              <Text style={styles.postActionText}>{formatCount(1730)}</Text>
            </View>
            <View style={[styles.postAction, styles.postActionRight]}>
              <CommentIcon />
              <Text style={styles.postActionText}>{formatCount(12)}</Text>
            </View>
          </View>

          <Text style={styles.time}>{formatTime(checkedOn)}</Text>

        </View>
      )}

      {(status === POST_STATUSES.PENDING || status === POST_STATUSES.DECLINED) && (
      <View style={styles.status}>
        <StatusBadge status={status} />
      </View>
      )}

    </View>
  );
}

Post.propTypes = {
  description: PropTypes.string,
  type: PropTypes.oneOf(Object.values(CONTENT_TYPES)).isRequired,
  contentUrl: PropTypes.string,
  avatarUrl: PropTypes.string,
  location: PropTypes.string,
  fullName: PropTypes.string,
  status: PropTypes.oneOf(Object.values(POST_STATUSES)).isRequired,
  checkedOn: PropTypes.string,
};

Post.defaultProps = {
  description: null,
  contentUrl: null,
  avatarUrl: null,
  location: null,
  fullName: null,
  checkedOn: null,
};

export default React.memo(Post);
