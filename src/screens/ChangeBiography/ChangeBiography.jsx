import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  SafeAreaView, ScrollView, Platform, View, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import Bin from 'assets/icons/bin.svg';
import CrossIcon from 'assets/icons/cross.svg';

import Header from 'components/Header';
import Input from 'components/Input';
import UploadMediaButton from 'components/UploadMediaButton';
import Video from 'components/Video';
import Text from 'components/Text';
import Viewable from 'components/Viewable';

import * as userActions from 'resources/user/user.actions';
import * as userSelectors from 'resources/user/user.selectors';
import * as userApi from 'resources/user/user.api';

import * as introVideoActions from 'store/introVideo/introVideo.actions';

import * as introVideoSelectors from 'store/introVideo/introVideo.selectors';

import { MEDIA_UPLOADING_STATUSES } from 'helpers/constants';
import { MEDIA_TYPES } from 'components/UploadMediaButton/UploadMediaButton.constants';

import analyticsService from 'services/analytics.service';

import useToast from 'hooks/useToast';

import colors from 'themes/colors';

import styles from './ChangeBiography.styles';

function ChangeBiography() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { showFailure, showSuccess } = useToast();

  const currentUserProcessingIntroVideo = useSelector(userSelectors.getUserProcessingIntroVideo);
  const uploadingIntroVideoData = useSelector(introVideoSelectors.getIntroVideo);
  const savedBiographyText = useSelector(userSelectors.getUserBiographyAbout);
  const savedIntroVideo = useSelector(userSelectors.getUserIntroVideo);

  const [biographyText, setBiographyText] = useState(savedBiographyText);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingIntroVideo, setUploadingIntroVideo] = useState(null);
  const [isSavedIntroVideoShown, setIsSavedIntroVideoShown] = useState(true);

  const isSaveButtonDisabled = isLoading
    || (savedBiographyText === biographyText && !uploadingIntroVideo && isSavedIntroVideoShown);

  const saveButtonProps = isSaveButtonDisabled
    ? { rightItemStyle: styles.disabledText }
    : {};

  useEffect(() => {
    const init = async () => {
      try {
        if (uploadingIntroVideoData?.status === MEDIA_UPLOADING_STATUSES.COMPLETED) {
          await dispatch(userActions.getUserData());
          await dispatch(introVideoActions.removeUploadingIntroVideoData());
        }
      } catch (error) {
        showFailure();
      }
    };

    init();
  }, [uploadingIntroVideoData?.status, dispatch, showFailure]);

  const onUploadStart = useCallback(async ({ data, file, progress, status, uploadId }) => {
    await dispatch(introVideoActions.startUploadingIntroVideoData({ data, file, progress, status, uploadId }));
  }, [dispatch]);

  const onUploadProgress = useCallback(async ({ id, data, file, progress, status, uploadId }) => {
    await dispatch(introVideoActions.updateUploadingIntroVideoData({ id, data, file, progress, status, uploadId }));
  }, [dispatch]);

  const hideSavedIntroVideo = useCallback(() => {
    setIsSavedIntroVideoShown(false);
  }, []);

  const onPressSave = useCallback(async () => {
    setIsLoading(true);

    try {
      const isBiographyTextUpdated = biographyText !== savedBiographyText;
      const isBiographyTextDeleted = !biographyText;
      const isIntroVideoDeleted = (!uploadingIntroVideo
        && !isSavedIntroVideoShown
        && savedIntroVideo
        && !uploadingIntroVideoData)
        || uploadingIntroVideoData?.status === MEDIA_UPLOADING_STATUSES.ERROR;

      let updatedUserPromise = Promise.resolve();

      if (isBiographyTextDeleted) {
        updatedUserPromise = userApi.deleteBiographyText();
      } else if (isBiographyTextUpdated) {
        updatedUserPromise = userApi.updateUserInfo({ about: biographyText });
      }

      if (uploadingIntroVideo && !uploadingIntroVideoData) {
        const params = {};
        params.width = uploadingIntroVideo.width.toString();
        params.height = uploadingIntroVideo.height.toString();

        const uri = Platform.OS === 'ios'
          ? uploadingIntroVideo.path
          : uploadingIntroVideo.path.replace('file://', '');

        const addIntroVideoUploading = userApi.addIntroVideo(params, uploadingIntroVideo && {
          name: 'file',
          type: uploadingIntroVideo.mime,
          uri,
        }, { onUploadProgress, onUploadStart });

        updatedUserPromise = addIntroVideoUploading;
      } else if (isIntroVideoDeleted) {
        updatedUserPromise = userApi.deleteIntroVideo();
      }

      dispatch(userActions.setUserData(await updatedUserPromise));
      showSuccess(t('ChangeBiography.updated'));
    } catch (err) {
      console.error('Updating biography error:', err);
      showFailure();
    }

    setIsLoading(false);

    analyticsService.logEvent({ name: analyticsService.events.FIGHTER_BIOGRAPHY_ADDED });

    if (uploadingIntroVideoData?.status === MEDIA_UPLOADING_STATUSES.ERROR) {
      await dispatch(introVideoActions.removeUploadingIntroVideoData());
    }

    navigation.goBack();
  }, [dispatch,
    savedBiographyText,
    savedIntroVideo,
    isSavedIntroVideoShown,
    biographyText,
    navigation,
    showSuccess,
    showFailure,
    t,
    uploadingIntroVideo,
    onUploadProgress,
    onUploadStart,
    uploadingIntroVideoData,
  ]);

  const handleMediaUpload = useCallback(async (media, poster) => {
    setIsLoading(true);

    if (uploadingIntroVideoData?.status === MEDIA_UPLOADING_STATUSES.ERROR) {
      await dispatch(introVideoActions.removeUploadingIntroVideoData());
    }

    if (currentUserProcessingIntroVideo?.videoProcessingError) {
      await userApi.deleteProcessingIntroVideo();
    }

    setUploadingIntroVideo(media);

    setIsLoading(false);
  }, [uploadingIntroVideoData?.status, dispatch, currentUserProcessingIntroVideo?.videoProcessingError]);

  const onDelete = useCallback(() => {
    setUploadingIntroVideo(null);
  }, []);

  const onCancelIntroVideoUploading = useCallback(async () => {
    hideSavedIntroVideo();

    try {
      await dispatch(introVideoActions.cancelUploadingIntroVideoData(uploadingIntroVideoData?.uploadId));
    } catch (error) {
      showFailure();
    }
  }, [dispatch, showFailure, uploadingIntroVideoData?.uploadId, hideSavedIntroVideo]);

  const savedIntroVideoPosterSource = useMemo(() => {
    return {
      uri: savedIntroVideo?.posterStorageUrl,
    };
  }, [savedIntroVideo?.posterStorageUrl]);

  const savedIntroVideoSource = useMemo(() => {
    return {
      uri: savedIntroVideo?.cloudflareHlsLink,
    };
  }, [savedIntroVideo?.cloudflareHlsLink]);

  let videoView;

  const ErrorUploadMediaButton = (
    <UploadMediaButton
      label={t('ChangeBiography.introVideo')}
      handleMediaUpload={handleMediaUpload}
      mediaType={MEDIA_TYPES.VIDEO}
      style={styles.uploadButton}
      onDelete={onDelete}
      errorLabelText={t('ChangeBiography.videoFailedToUpload')}
    />
  );

  if (currentUserProcessingIntroVideo) {
    if (currentUserProcessingIntroVideo.videoProcessingError) {
      videoView = ErrorUploadMediaButton;
    } else {
      videoView = (
        <View style={styles.processingIntroVideoContainer}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.processingText}>{t('Account.processing')}</Text>
        </View>
      );
    }
  } else if (uploadingIntroVideoData?.status === MEDIA_UPLOADING_STATUSES.UPLOADING) {
    videoView = (
      <View style={styles.uploadingContainer}>
        <Text style={styles.loadingPostText}>
          {t('ChangeBiography.videoIsLoading')}
        </Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${uploadingIntroVideoData.progress}%` }]} />
        </View>
        {uploadingIntroVideoData.progress !== 100 && (
        <TouchableOpacity
          style={styles.crossIcon}
          activeOpacity={0.7}
          onPress={onCancelIntroVideoUploading}
        >
          <CrossIcon />
        </TouchableOpacity>
        )}
      </View>
    );
  } else if (uploadingIntroVideoData?.status === MEDIA_UPLOADING_STATUSES.ERROR) {
    videoView = ErrorUploadMediaButton;
  } else if (savedIntroVideo && isSavedIntroVideoShown) {
    videoView = (
      <View style={styles.videoContainer}>
        <Viewable>
          <Video
            posterSource={savedIntroVideoPosterSource}
            source={savedIntroVideoSource}
            width={savedIntroVideo.width}
            height={savedIntroVideo.height}
            duration={savedIntroVideo.duration}
          />
        </Viewable>

        <TouchableOpacity
          style={styles.bin}
          activeOpacity={0.7}
          onPress={hideSavedIntroVideo}
        >
          <Bin />
        </TouchableOpacity>
      </View>
    );
  } else {
    videoView = (
      <UploadMediaButton
        label={t('ChangeBiography.introVideo')}
        handleMediaUpload={handleMediaUpload}
        mediaType={MEDIA_TYPES.VIDEO}
        style={styles.uploadButton}
        onDelete={onDelete}
      />
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Header
        title={(savedBiographyText || savedIntroVideo)
          ? t('ChangeBiography.changeBiography')
          : t('ChangeBiography.addBiography')}
        leftItemType="backArrow"
        rightItemType="text"
        rightItemText={t('ChangeBiography.save')}
        onRightItemPress={onPressSave}
        rightItemDisabled={isSaveButtonDisabled}
        {...saveButtonProps}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {videoView}

        <Input
          label={t('ChangeBiography.biography')}
          value={biographyText}
          onChange={setBiographyText}
          maxLength={300}
          style={styles.input}
          multiline
          numberOfLines={20}
        />

        <View style={styles.textContainer}>
          <Text style={styles.grayText}>{t('ChangeBiography.descriptionText')}</Text>
        </View>
      </ScrollView>

      {isLoading && (
        <>
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
          <View style={styles.loaderOverlay} />
        </>
      )}
    </SafeAreaView>
  );
}

export default React.memo(ChangeBiography);
