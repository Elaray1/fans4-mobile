import React, { useState, useCallback, useMemo } from 'react';
import {
  SafeAreaView, ScrollView, Platform, View, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import Bin from 'assets/icons/bin.svg';

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

  const savedBiographyText = useSelector(userSelectors.getUserBiographyAbout);
  const savedIntroVideo = useSelector(userSelectors.getUserIntroVideo);

  const [biographyText, setBiographyText] = useState(savedBiographyText);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingIntroVideo, setUploadingIntroVideo] = useState(null);
  const [isSavedIntroVideoShown, setIsSavedIntroVideoShown] = useState(true);

  const isSaveButtonDisabled = isLoading
    || (!biographyText && !uploadingIntroVideo)
    || (savedBiographyText === biographyText && !uploadingIntroVideo && isSavedIntroVideoShown);

  const saveButtonProps = isSaveButtonDisabled
    ? { rightItemStyle: styles.disabledText }
    : {};

  const onUploadProgress = useCallback(async ({ id, data, file, progress, status }) => {
    await dispatch(introVideoActions.updateUploadingIntroVideoData({ id, data, file, progress, status }));
  }, [dispatch]);

  const hideSavedIntroVideo = useCallback(() => {
    setIsSavedIntroVideoShown(false);
  }, []);

  const onPressSave = useCallback(async () => {
    setIsLoading(true);

    const params = {};
    if (uploadingIntroVideo) {
      params.width = uploadingIntroVideo.width.toString();
      params.height = uploadingIntroVideo.height.toString();
    }

    try {
      const user = await userApi.updateUserInfo({
        about: biographyText,
        isIntroVideo: Boolean(isSavedIntroVideoShown),
      });

      dispatch(userActions.setUserData(user));

      if (uploadingIntroVideo) {
        const uri = Platform.OS === 'ios' ? uploadingIntroVideo.path : uploadingIntroVideo.path.replace('file://', '');

        await userApi.addIntroVideo(params, uploadingIntroVideo && {
          name: 'file',
          type: uploadingIntroVideo.mime,
          uri,
        }, { onUploadProgress });
      }

      showSuccess(t('ChangeBiography.updated'));
    } catch (err) {
      console.error('Updating biography error:', err);
      showFailure();
    }

    setIsLoading(false);

    analyticsService.logEvent({ name: analyticsService.events.FIGHTER_BIOGRAPHY_ADDED });

    navigation.goBack();
  }, [dispatch,
    biographyText,
    navigation,
    showSuccess,
    showFailure,
    t,
    uploadingIntroVideo,
    onUploadProgress,
    isSavedIntroVideoShown,
  ]);

  const handleMediaUpload = useCallback((media, poster) => {
    setIsLoading(true);
    setUploadingIntroVideo(media);

    setIsLoading(false);
  }, []);

  const onDelete = useCallback(() => {
    setUploadingIntroVideo(null);
  }, []);

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

  if (savedIntroVideo && isSavedIntroVideoShown) {
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
