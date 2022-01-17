import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import analyticsService from 'services/analytics.service';

import * as userSelectors from 'resources/user/user.selectors';

import * as postApi from 'resources/post/post.api';

import * as videoPlaybackApi from 'resources/videoPlayback/videoPlayback.api';

import Text from 'components/Text';
import StatusBadge from 'components/StatusBadge';
import Video from 'components/Video';
import Modal from 'components/Modal';
import EditPostModal from 'components/Post/components/EditPostModal';

import LikeIcon from 'assets/icons/like';
import CommentIcon from 'assets/icons/comment';
import LockIcon from 'assets/icons/lock';
import DotsIcon from 'assets/icons/dots';

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
  onGoBackFromComments,
  onHidePostFromFeed,
  createdOn,
}) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { showFailure } = useToast();

  const userId = useSelector(userSelectors.getUserId);
  const userType = useSelector(userSelectors.getUserType);
  const userSubscriptions = useSelector(userSelectors.getSupportedFighters);

  const [likesCount, setLikesCount] = useState(likedUsers.length);
  const [likedUsersState, setLikedUsersState] = useState(likedUsers);
  const [isLiked, setIsLiked] = useState(likedUsersState.some(u => u._id === userId));
  const [likedNames, setLikedNames] = useState(likedUsersState.length === 2
    ? `${likedUsersState[1]?.name} and ${likedUsersState[0]?.name}`
    : likedUsersState[0]?.name);

  const [isEditPostModal, setIsEditPostModal] = useState(false);
  const [isRemoveFromFeedConfirmationModal, setIsRemoveFromFeedConfirmationModal] = useState(false);
  const [isRemovePostConfirmationModal, setIsRemovePostConfirmationModal] = useState(false);

  const [isProcessingErrorPostButtonDisabled, setIsProcessingErrorPostButtonDisabled] = useState(false);

  const iconsColor = disabled ? colors.whiteDisabled : colors.white;

  const isSubscribedOrAuthor = userType === USER_TYPES.FIGHTER
  || !!userSubscriptions.length
  || author._id === FANS4_ACCOUNT._id;

  const likedByText = `Liked by ${likedNames} ${likesCount - 1 > 1 ? `and ${likesCount - 1} others` : ''}`;
  const isPostAuthor = userId === author?._id;

  const [videoLink, setVideoLink] = useState(null);

  useEffect(() => {
    setLikesCount(likedUsersState.length);
    setIsLiked(likedUsersState.some(u => u._id === userId));

    setLikedNames(likedUsersState.length === 2
      ? `${likedUsersState[1]?.name} and ${likedUsersState[0]?.name}`
      : likedUsersState[0]?.name);
  }, [userId, likedUsersState]);

  const mediaType = media && media.type;

  useEffect(() => {
    if (mediaType !== MEDIA_TYPES.VIDEO) {
      return;
    }

    const getVideoLink = async () => {
      let retryCount = 0;
      let link;

      while (retryCount < 3 && !link) {
        try {
          ({ link } = await postApi.getVideoLink(_id)); // eslint-disable-line no-await-in-loop
          setVideoLink(link);
        } catch (err) {
          retryCount += 1;
          console.error('getting video link error:', err);
        }
      }
    };

    getVideoLink();
  }, [_id, mediaType]);

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

  const videoSource = useMemo(() => {
    if (!media || media.type !== MEDIA_TYPES.VIDEO || !videoLink) {
      return null;
    }

    return {
      uri: videoLink,
    };
  }, [media, videoLink]);

  const onPressFighter = useCallback(() => {
    if (author?._id === FANS4_ACCOUNT._id) {
      navigation.navigate('Fans4Profile');
    } else {
      navigation.navigate('Fighter', { _id: author?._id });
    }
  }, [navigation, author?._id]);

  const onOpenEditPostModal = useCallback(() => {
    setIsEditPostModal(true);
  }, []);

  const onCloseEditPostModal = useCallback(() => {
    setIsEditPostModal(false);
  }, []);

  const onVideoStarted = useCallback(async ({ startLoadingDate, endLoadingDate }) => {
    const delayMs = moment(endLoadingDate).diff(startLoadingDate);

    const { type: networkType } = await NetInfo.fetch();

    analyticsService.logEvent({
      name: analyticsService.events.VIDEO_PLAYBACK_STARTED,
      data: {
        postId: _id,
        delayMs,
        networkType,
      },
    });

    try {
      await videoPlaybackApi.createVideoPlayback({
        viewerId: userId,
        postId: _id,
        delayMs,
        networkType,
        os: Platform.OS,
      });
    } catch (error) {
      console.log('creating video playback error: ', error);
    }
  }, [userId, _id]);

  const onOpenRemovePostFromFeedConfirmationModal = useCallback((isRemovedByAdmin) => {
    if (isRemovedByAdmin) {
      setIsRemoveFromFeedConfirmationModal(true);
    } else {
      setIsRemovePostConfirmationModal(true);
    }
    setIsEditPostModal(false);
  }, []);

  const onCloseRemoveFromFeedConfirmationModal = useCallback(() => {
    setIsRemoveFromFeedConfirmationModal(false);
    setIsRemovePostConfirmationModal(false);
  }, []);

  const onRemovePostFromFeedConfirmation = useCallback(async () => {
    try {
      const updatedPost = await postApi.removePostFromFeed(_id);
      onHidePostFromFeed(updatedPost);
    } catch (error) {
      showFailure();
    }

    setIsRemoveFromFeedConfirmationModal(false);
    setIsRemovePostConfirmationModal(false);
    setIsEditPostModal(false);
  }, [showFailure, onHidePostFromFeed, _id]);

  const onEditPost = useCallback(() => {
    setIsEditPostModal(false);
    navigation.navigate('EditPost', { postId: _id });
  }, [navigation, _id]);

  const onNavigateToAddPost = useCallback(async () => {
    setIsProcessingErrorPostButtonDisabled(true);
    try {
      const updatedPost = await postApi.removeProcessingErrorPost(_id);
      onHidePostFromFeed(updatedPost);
    } catch (error) {
      showFailure();
    }
    navigation.navigate('NewPost');
    setIsProcessingErrorPostButtonDisabled(false);
  }, [navigation, _id, showFailure, onHidePostFromFeed]);

  const authorView = author ? (
    <View style={styles.postHeader}>
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

      {isPostAuthor
      && (status !== POST_STATUSES.PROCESSING)
      && (status !== POST_STATUSES.PROCESSING_ERROR)
      && (
        <TouchableOpacity onPress={onOpenEditPostModal}>
          <DotsIcon />
        </TouchableOpacity>
      )}
    </View>
  ) : null;


  let contentContainerView = null;

  if (media) {
    let mediaView;

    if (media.type === MEDIA_TYPES.IMAGE) {
      const source = {
        uri: `${config.apiUrl}/posts/${_id}/media`,
        headers: {
          Authorization: `Bearer ${config.accessToken}`,
          'X-Application-ID': config.applicationId,
        },
      };

      mediaView = (
        <View style={styles.mediaContainer}>
          <FastImage
            style={[styles.postImage, { aspectRatio: media.width / media.height }]}
            source={source}
          />
        </View>
      );
    } else if (status === POST_STATUSES.PROCESSING) {
      mediaView = (
        <>
          <View style={styles.processingMediaContainer}>
            <ActivityIndicator size="large" color="white" />
            <Text style={styles.processingText}>{t('Post.processing')}</Text>
          </View>
        </>
      );
    } else if (status === POST_STATUSES.PROCESSING_ERROR) {
      mediaView = (
        <>
          <View style={styles.processingMediaContainer}>
            <View>
              <Text style={styles.processingText}>{t('Post.videoFailedToProcess')}</Text>
              <Text style={styles.processingText}>{t('Post.pleaseTryAgain')}</Text>
            </View>
            <TouchableOpacity
              style={styles.tryAgain}
              onPress={onNavigateToAddPost}
              disabled={isProcessingErrorPostButtonDisabled}
            >
              <Text style={styles.tryAgainText}>{t('Post.tryAgain')}</Text>
            </TouchableOpacity>
          </View>
        </>
      );
    } else {
      mediaView = (
        <View style={styles.mediaContainer}>
          <Video
            posterSource={posterSource}
            source={videoSource}
            width={media.width}
            height={media.height}
            duration={media.duration}
            viewable={viewable}
            onVideoStarted={onVideoStarted}
          />
        </View>
      );
    }

    contentContainerView = (
      <>
        {mediaView}
        {Boolean(text) && (
          <View style={styles.textContainer}>
            <Text style={styles.description}>
              {text}
            </Text>
          </View>
        )}
      </>
    );
  } else if (text) {
    contentContainerView = (
      <View style={styles.textContainer}>
        <Text style={styles.description}>
          {text}
        </Text>
      </View>
    );
  } else {
    contentContainerView = (
      <View style={styles.blockedPost}>
        <LockIcon />
      </View>
    );
  }

  const onCommentsPress = useCallback(() => {
    navigation.navigate('Comments', { postId: _id, onUpdateCommentsCount, onGoBack: onGoBackFromComments });
  }, [navigation, _id, onUpdateCommentsCount, onGoBackFromComments]);

  const onLikePress = useCallback(async () => {
    try {
      let updatedPost;
      if (isLiked) {
        updatedPost = await postApi.removeLikeFromPost(_id);
      } else {
        updatedPost = await postApi.likePost(_id);
      }
      setLikedUsersState(updatedPost.likedUsers);
    } catch (error) {
      showFailure();
    }
  }, [isLiked, _id, showFailure]);

  const onSeeLikes = useCallback(() => {
    if (isSubscribedOrAuthor) {
      navigation.navigate('LikesList', { likedUsers: likedUsersState });
    }
  }, [isSubscribedOrAuthor, likedUsersState, navigation]);

  return (
    <>
      {isRemoveFromFeedConfirmationModal && (
        <Modal
          title={t('Post.removePost')}
          text={t('Post.thisPostWillNoLongerBeVisibleInYourFeed')}
          closeButtonText={t('Post.keepIt')}
          submitButtonText={t('Post.remove')}
          onClose={onCloseRemoveFromFeedConfirmationModal}
          onSubmit={onRemovePostFromFeedConfirmation}
        />
      )}

      {isRemovePostConfirmationModal && (
        <Modal
          title={t('Post.deletePost')}
          text={t('Post.thisPostWillNoLongerBeAvailableForYouAndYourFans')}
          closeButtonText={t('Post.keepIt')}
          submitButtonText={t('Post.delete')}
          onClose={onCloseRemoveFromFeedConfirmationModal}
          onSubmit={onRemovePostFromFeedConfirmation}
        />
      )}

      <EditPostModal
        onClose={onCloseEditPostModal}
        visible={isEditPostModal}
        isRemovedByAdmin={status === POST_STATUSES.REMOVED}
        onEdit={onEditPost}
        onRemoveFromFeed={onOpenRemovePostFromFeedConfirmationModal}
      />

      <View
        style={[
          styles.post,
          status === POST_STATUSES.PROCESSING && text && styles.processingPostWithText,
        ]}
      >
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
    </>
  );
}

Post.propTypes = {
  _id: PropTypes.string.isRequired,
  text: PropTypes.string,
  media: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    type: PropTypes.oneOf(Object.values(MEDIA_TYPES)).isRequired,
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
  onGoBackFromComments: PropTypes.func,
  onHidePostFromFeed: PropTypes.func,
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
  onHidePostFromFeed: () => null,
  onGoBackFromComments: undefined,
};

export default React.memo(Post);
