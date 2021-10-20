import React, { useCallback, useState, useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

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
import { USER_TYPES } from 'resources/user/user.constants';
import { FANS4_ACCOUNT } from 'helpers/constants';

import { formatCount, formatTime } from './Post.helpers';

import styles from './Post.styles';

function Post({
  _id,
  text,
  media,
  author,
  status,
  checkedOn,
  likedUsers,
  commentsCount,
  disabled,
  viewable,
  onUpdateCommentsCount,
  createdOn,
}) {
  const navigation = useNavigation();
  const { showFailure } = useToast();

  const userId = useSelector(userSelectors.getUserId);
  const userType = useSelector(userSelectors.getUserType);
  const userSubscriptions = useSelector(userSelectors.getSupportedFighters);

  const [likesCount, setLikesCount] = useState(likedUsers.length);
  const [isLiked, setIsLiked] = useState(likedUsers.some(u => u._id === userId));
  const [likedNames, setLikedNames] = useState(likedUsers.length === 2
    ? `${likedUsers[likesCount - 1]?.name} and ${likedUsers[likesCount - 2]?.name}`
    : likedUsers[likesCount - 1]?.name);
  const iconsColor = disabled ? colors.whiteDisabled : colors.white;
  const isSubscribedOrAuthor = userType === USER_TYPES.FIGHTER || userSubscriptions.some(f => f._id === author._id);
  const likedByText = `Liked by ${likedNames} ${likesCount - 1 > 1 ? `and ${likesCount - 1}` : ''}`;

  const posterSource = useMemo(() => {
    if (media && media.type === MEDIA_TYPES.VIDEO && media.posterStorageUrl) {
      return {
        uri: `${config.apiUrl}/posts/${_id}/video-poster`,
        headers: {
          Authorization: `Bearer ${config.accessToken}`,
          'X-Application-ID': config.applicationId,
        },
      };
    }
    return null;
  }, [_id, media]);

  const onPressFighter = useCallback(() => {
    if (author?._id === FANS4_ACCOUNT._id) {
      navigation.navigate('Fans4Profile');
    } else {
      navigation.navigate('Fighter', { _id: author?._id });
    }
  }, [navigation, author?._id]);

  const authorView = author ? (
    <TouchableOpacity
      onPress={onPressFighter}
      style={styles.author}
    >
      <FastImage
        style={styles.authorAvatar}
        source={{ uri: author.avatarUrl }}
      />
      <Text style={styles.authorFullName}>
        {author.fullName}
      </Text>
    </TouchableOpacity>
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
          <FastImage
            style={[styles.postImage, { aspectRatio: media.width / media.height }]}
            source={source}
          />
        </View>
      );
    } else {
      mediaView = (
        <View style={styles.mediaContainer}>
          <Video
            posterSource={posterSource}
            source={source}
            width={media.width}
            height={media.height}
            duration={media.duration}
            viewable={viewable}
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
    navigation.navigate('Comments', { postId: _id, onUpdateCommentsCount });
  }, [navigation, _id, onUpdateCommentsCount]);

  const onLikePress = useCallback(async () => {
    try {
      let updatedPost;
      if (isLiked) {
        updatedPost = await postApi.removeLikeFromPost(_id);
      } else {
        updatedPost = await postApi.likePost(_id);
      }
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
      setIsLiked(updatedPost.likedUsers.some(u => u._id === userId));
      setLikedNames(updatedPost?.likedUsers?.length === 2
        ? `${updatedPost?.likedUsers[updatedPost.likedUsers.length - 1]?.name} and ${
          updatedPost?.likedUsers[updatedPost.likedUsers.length - 2]?.name}`
        : updatedPost?.likedUsers[updatedPost.likedUsers.length - 1]?.name);
    } catch (error) {
      showFailure();
    }
  }, [isLiked, likesCount, _id, userId, showFailure]);

  const onSeeLikes = useCallback(() => {
    if (isSubscribedOrAuthor) {
      navigation.navigate('LikesList', { likedUsers });
    }
  }, [isSubscribedOrAuthor, likedUsers, navigation]);

  return (
    <View style={styles.post}>
      {authorView}
      {contentContainerView}
      {status === POST_STATUSES.APPROVED && (
        <View style={[styles.status, styles.approvedStatus]}>
          <View>
            {Boolean(likesCount) && (
              <>
                {isSubscribedOrAuthor ? (
                  <TouchableOpacity onPress={onSeeLikes}>
                    <Text style={styles.likedBy}>
                      {likedByText}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.likedBy}>
                    {likedByText}
                  </Text>
                )}
              </>
            )}
            <View style={styles.postActions}>
              <TouchableOpacity
                onPress={onLikePress}
                activeOpacity={0.7}
                style={styles.postAction}
                disabled={disabled}
              >
                {isLiked ? (
                  <LikeIcon
                    stroke={iconsColor}
                    fill={iconsColor}
                  />
                ) : <LikeIcon stroke={iconsColor} />}
                {Boolean(likesCount)
                && (
                <Text style={[styles.postActionText, disabled && styles.disabled]}>{formatCount(likesCount)}
                </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onCommentsPress}
                activeOpacity={0.7}
                style={[styles.postAction, styles.postActionRight]}
                disabled={disabled}
              >
                <CommentIcon stroke={iconsColor} />
                {Boolean(commentsCount)
                && (
                <Text style={[styles.postActionText, disabled && styles.disabled]}>
                  {formatCount(commentsCount)}
                </Text>
                )
                }
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.time}>{formatTime(checkedOn || createdOn)}</Text>
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
    posterStorageUrl: PropTypes.string,
    duration: PropTypes.number,
  }),
  author: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.isRequired,
  }),
  status: PropTypes.oneOf(Object.values(POST_STATUSES)).isRequired,
  checkedOn: PropTypes.string,
  likedUsers: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })),
  commentsCount: PropTypes.number,
  disabled: PropTypes.bool,
  viewable: PropTypes.bool,
  createdOn: PropTypes.string,
  onUpdateCommentsCount: PropTypes.func,
};

Post.defaultProps = {
  text: null,
  media: null,
  author: null,
  checkedOn: null,
  createdOn: null,
  likedUsers: [],
  commentsCount: 0,
  disabled: false,
  viewable: false,
  onUpdateCommentsCount: () => null,
};

export default React.memo(Post);
