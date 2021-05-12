import React from 'react';
import { View, Image } from 'react-native';
import PropTypes from 'prop-types';

import { MEDIA_TYPES, POST_STATUSES } from 'resources/post/post.constants';

import Text from 'components/Text';
import StatusBadge from 'components/StatusBadge';
import Video from 'components/Video';

import LikeIcon from 'assets/icons/like';
import CommentIcon from 'assets/icons/comment';

import config from 'resources/config';
import { formatCount, formatTime } from './Post.helpers';
import styles from './Post.styles';

function Post({
  _id,
  text,
  media,
  author,
  status,
  checkedOn,
}) {
  const authorView = author ? (
    <View style={styles.author}>
      <Image
        style={styles.authorAvatar}
        source={{ uri: author.avatarUrl }}
      />
      <Text style={styles.authorFullName}>
        {author.fullName}
      </Text>
    </View>
  ) : null;

  let contentContainerView = null;
  if (media) {
    const source = {
      uri: `${config.apiUrl}/posts/${_id}/media`,
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        'X-Application-ID': config.applicationId,
      },
    };

    let mediaView;
    if (media.type === MEDIA_TYPES.IMAGE) {
      mediaView = (
        <View style={styles.mediaContainer}>
          <Image
            style={[styles.postImage, { aspectRatio: media.width / media.height }]}
            source={source}
          />
        </View>

      );
    } else {
      mediaView = (
        <View style={styles.mediaContainer}>
          <Video
            source={source}
            aspectRatio={media.width / media.height}
          />
        </View>
      );
    }

    contentContainerView = (
      <>
        {mediaView}
        {Boolean(text) && <Text style={styles.description}>{text}</Text>}
      </>
    );
  } else {
    contentContainerView = (
      <Text style={styles.description}>{text}</Text>
    );
  }

  return (
    <View style={styles.post}>
      {authorView}
      {contentContainerView}
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
  _id: PropTypes.string.isRequired,
  text: PropTypes.string,
  media: PropTypes.shape({
    type: PropTypes.oneOf(Object.values(MEDIA_TYPES)).isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }),
  author: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.isRequired,
  }),
  status: PropTypes.oneOf(Object.values(POST_STATUSES)).isRequired,
  checkedOn: PropTypes.string,
};

Post.defaultProps = {
  text: null,
  media: null,
  author: null,
  checkedOn: null,
};

export default React.memo(Post);
