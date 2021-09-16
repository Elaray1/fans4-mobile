import React, { useState, useMemo, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import useToast from 'hooks/useToast';

import ArrowUpIcon from 'assets/icons/arrow-up';
import ArrowDownIcon from 'assets/icons/arrow-down';

import Text from 'components/Text';
import Video from 'components/Video';

import * as introVideoActions from 'resources/introVideo/introVideo.actions';
import * as introVideoSelectors from 'resources/introVideo/introVideo.selectors';

import * as userSelectors from 'resources/user/user.selectors';
import * as userApi from 'resources/user/user.api';
import * as userActions from 'resources/user/user.actions';

import { MEDIA_UPLOADING_STATUSES } from 'helpers/constants';

import styles from './styles';

const Biography = ({
  userId,
  biography,
  introVideo,
  onAddBiographyPress,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { showFailure } = useToast();

  const uploadingIntroVideo = useSelector(introVideoSelectors.getIntroVideo);
  const currentUserId = useSelector(userSelectors.getUserId);
  const userIntroVideo = useSelector(userSelectors.getUserIntroVideo);

  const [isOpen, setIsOpen] = useState(currentUserId === userId ? !(biography && introVideo) : Boolean(introVideo));
  const [isLoading, setIsLoading] = useState(false);

  const onUploadProgress = useCallback(async ({ id, data, file, progress, status }) => {
    await dispatch(introVideoActions.updateUploadingIntroVideoData({ id, data, file, progress, status }));
  }, [dispatch]);

  useEffect(() => {
    const init = async () => {
      if (uploadingIntroVideo?.status === MEDIA_UPLOADING_STATUSES.COMPLETED) {
        await dispatch(userActions.getUserData());
        await dispatch(introVideoActions.removeUploadingIntroVideoData());
      }
    };

    init();
  }, [uploadingIntroVideo?.status, dispatch]);

  const onReuploadPost = useCallback(async () => {
    setIsLoading(true);
    try {
      await userApi.addIntroVideo(uploadingIntroVideo?.data, uploadingIntroVideo?.file, { onUploadProgress });
    } catch (error) {
      showFailure();
    }
    setIsLoading(false);
  }, [onUploadProgress, uploadingIntroVideo?.data, uploadingIntroVideo?.file, showFailure]);

  const onBiographyPress = () => {
    setIsOpen(!isOpen);
  };

  const posterSource = useMemo(() => {
    return {
      uri: userIntroVideo?.posterStorageUrl,
    };
  }, [userIntroVideo?.posterStorageUrl]);

  const source = useMemo(() => {
    return {
      uri: userIntroVideo?.storageUrl,
    };
  }, [userIntroVideo?.storageUrl]);

  const uploadingVideoView = useMemo(() => {
    if (uploadingIntroVideo?.status === MEDIA_UPLOADING_STATUSES.UPLOADING) {
      const { progress } = uploadingIntroVideo;

      return (
        <View style={styles.uploadingContainer}>
          <Text style={styles.loadingPostText}>
            {t('Account.videoIsLoading')}
          </Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
        </View>
      );
    }

    if (uploadingIntroVideo?.status === MEDIA_UPLOADING_STATUSES.ERROR) {
      return (
        <View style={styles.uploadingContainer}>
          <View>
            <Text style={styles.loadingPostText}>
              {t('Account.videoFailedToUpload')}
            </Text>
            <Text style={[styles.loadingPostText, styles.uploadFailedText]}>{t('Account.pleaseTryAgain')}</Text>
          </View>
          <TouchableOpacity
            style={styles.tryAgain}
            activeOpacity={0.7}
            onPress={onReuploadPost}
            disabled={isLoading}
          >
            <Text style={styles.tryAgainText}>{t('Account.tryAgain')}</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }, [t, uploadingIntroVideo, onReuploadPost, isLoading]);

  const introVideoView = useMemo(() => {
    if (userId === currentUserId && uploadingIntroVideo) {
      return uploadingVideoView;
    }
    if (introVideo) {
      return (
        <View style={styles.introVideo}>
          <Video
            posterSource={posterSource}
            source={source}
            width={introVideo.width}
            height={introVideo.height}
            duration={introVideo.duration}
            viewable
          />
        </View>
      );
    }

    if (onAddBiographyPress && biography) {
      return (
        <TouchableOpacity
          style={styles.addBiographyContainter}
          activeOpacity={0.7}
          onPress={onAddBiographyPress}
        >
          <Text style={[styles.addText, styles.addVideoText]}>
            {t('Account.addIntroVideo')}
          </Text>
        </TouchableOpacity>
      );
    }

    return null;
  }, [
    introVideo,
    t,
    onAddBiographyPress,
    biography,
    uploadingIntroVideo,
    uploadingVideoView,
    currentUserId,
    userId,
    posterSource,
    source,
  ]);

  const biographyView = useMemo(() => {
    if (biography) {
      return (
        <Text style={styles.biographyText}>
          {biography}
        </Text>
      );
    }

    if (onAddBiographyPress) {
      return (
        <TouchableOpacity
          style={styles.addBiographyContainter}
          activeOpacity={0.7}
          onPress={onAddBiographyPress}
        >
          <Text style={[styles.addText, introVideo ? styles.addBiographyText : styles.addBiographyAndVideoText]}>
            {introVideo ? t('Account.addBiography') : t('Account.addBiographyAndIntroVideo')}
          </Text>
        </TouchableOpacity>
      );
    }

    if (introVideo) {
      return null;
    }

    return (
      <Text style={styles.biographyText}>
        {t('Fighter.fighterHasntAddedBiographyYet')}
      </Text>
    );
  }, [biography, onAddBiographyPress, t, introVideo]);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.biographyBlock}
      onPress={onBiographyPress}
    >
      <View
        style={[styles.biographyData, !isOpen && styles.biographyClosedData]}
      >
        <Text style={styles.blockTitle}>
          {t('Account.biography')}
        </Text>
        {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
      </View>

      {isOpen && (
      <View>
        {introVideoView}
        {biographyView}
      </View>
      )}
    </TouchableOpacity>
  );
};

Biography.propTypes = {
  userId: PropTypes.string.isRequired,
  biography: PropTypes.string,
  introVideo: PropTypes.shape(),
  onAddBiographyPress: PropTypes.func,
};

Biography.defaultProps = {
  biography: null,
  introVideo: null,
  onAddBiographyPress: null,
};

export default React.memo(Biography);
