import React, { useCallback, useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import * as userSelectors from 'resources/user/user.selectors';

import * as postApi from 'resources/post/post.api';

import Text from 'components/Text';
import StatusBadge from 'components/StatusBadge';
import Video from 'components/Video';

import LikeIcon from 'assets/icons/like';
import CommentIcon from 'assets/icons/comment';
import LockIcon from 'assets/icons/lock';

import config from 'resources/config';

import useToast from 'hooks/useToast';
import colors from 'themes/colors';
import { MEDIA_TYPES, POST_STATUSES } from 'resources/post/post.constants';
import { formatCount, formatTime } from './Post.helpers';

import styles from './Post.styles';

function Post({
  _id,
  text,
  media,
  author,
  status,
  checkedOn,
  likedUserIds,
  commentsCount,
}) {
  const navigation = useNavigation();
  const { showFailure } = useToast();

  const userId = useSelector(userSelectors.getUserId);

  const [likesCount, setLikesCount] = useState(likedUserIds.length);
  const [isLiked, setIsLiked] = useState(likedUserIds.some(id => id === userId));

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
            width={media.width}
            height={media.height}
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
  } else if (text) {
    contentContainerView = (
      <Text style={styles.description}>{text}</Text>
    );
  } else {
    contentContainerView = (
      <View style={styles.blockedPost}>
        <LockIcon />
      </View>
    );
  }

  const onCommentsPress = useCallback(() => {
    navigation.navigate('Comments', { postId: _id });
  }, [navigation, _id]);

  const onLikePress = useCallback(async () => {
    try {
      let updatedPost;
      if (isLiked) {
        updatedPost = await postApi.removeLikeFromPost(_id);
      } else {
        updatedPost = await postApi.likePost(_id);
      }
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
      setIsLiked(updatedPost.likedUserIds.some(id => id === userId));
    } catch (error) {
      showFailure();
    }
  }, [_id, showFailure, userId, isLiked, likesCount]);

  return (
    <View style={styles.post}>
      {authorView}
      {contentContainerView}
      {status === POST_STATUSES.APPROVED && (
        <View style={[styles.status, styles.approvedStatus]}>
          <View style={styles.postActions}>
            <TouchableOpacity
              onPress={onLikePress}
              activeOpacity={0.7}
              style={[styles.postAction]}
            >
              {isLiked ? <LikeIcon fill={colors.white} /> : <LikeIcon />}
              <Text style={styles.postActionText}>{formatCount(likesCount)}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onCommentsPress}
              activeOpacity={0.7}
              style={[styles.postAction, styles.postActionRight]}
            >
              <CommentIcon />
              <Text style={styles.postActionText}>{formatCount(commentsCount)}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.time}>{formatTime(checkedOn)}</Text>

        </View>
      )}

      {(status === POST_STATUSES.PENDING
      || status === POST_STATUSES.DECLINED
      || status === POST_STATUSES.REMOVED
      ) && (
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
  likedUserIds: PropTypes.arrayOf(PropTypes.string),
  commentsCount: PropTypes.number,
};

Post.defaultProps = {
  text: null,
  media: null,
  author: null,
  checkedOn: null,
  likedUserIds: [],
  commentsCount: 0,
};

export default React.memo(Post);
