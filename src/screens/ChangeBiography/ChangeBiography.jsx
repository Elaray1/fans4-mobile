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

import * as userActions from 'resources/user/user.actions';
import * as userSelectors from 'resources/user/user.selectors';
import * as userApi from 'resources/user/user.api';

import * as introVideoSelectors from 'store/introVideo/introVideo.selectors';
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

  const uploadingIntroVideo = useSelector(introVideoSelectors.getIntroVideo);
  const initialValue = useSelector(userSelectors.getUserBiographyAbout);
  const initialMedia = useSelector(userSelectors.getUserIntroVideo);

  const [value, setValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingPoster, setUploadingPoster] = useState(null);
  const [uploadingMedia, setUploadingMedia] = useState(initialMedia);

  const isSaveButtonDisabled = isLoading
  || (!value && !uploadingMedia)
  || (initialValue === value && initialMedia === uploadingMedia);

  const saveButtonProps = isSaveButtonDisabled
    ? { rightItemStyle: styles.disabledText }
    : {};

  const onUploadProgress = useCallback(async ({ id, data, file, progress, status }) => {
    await dispatch(introVideoActions.updateUploadingIntroVideoData({ id, data, file, progress, status }));
  }, [dispatch]);

  const onBinPress = useCallback(() => {
    setUploadingMedia(null);
    setUploadingPoster(null);
  }, []);

  const onPressSave = useCallback(async () => {
    setIsLoading(true);

    const params = {};
    if (uploadingMedia) {
      params.width = uploadingMedia.width.toString();
      params.height = uploadingMedia.height.toString();
    }

    try {
      const user = await userApi.updateUserInfo({
        about: value,
        ...(!uploadingMedia && { removeIntroVideo: true }),
      });

      dispatch(userActions.setUserData(user));

      if (uploadingPoster && uploadingMedia) {
        const {
          url,
        } = await userApi.createIntroVideoPoster({}, uploadingPoster && {
          name: 'file',
          type: uploadingPoster.mime,
          uri: uploadingPoster.path,
        });

        params.posterStorageUrl = url;
        params.duration = uploadingMedia.duration.toString();


        const uri = Platform.OS === 'ios' ? uploadingMedia.path : uploadingMedia.path.replace('file://', '');

        await userApi.addIntroVideo(params, uploadingMedia && {
          name: 'file',
          type: uploadingMedia.mime,
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
    value,
    navigation,
    showSuccess,
    showFailure,
    t,
    uploadingMedia,
    onUploadProgress,
    uploadingPoster,
  ]);

  const handleMediaUpload = useCallback((media, poster) => {
    setIsLoading(true);
    setUploadingMedia(media);

    if (setUploadingPoster) {
      setUploadingPoster(poster);
    }

    setIsLoading(false);
  }, [setUploadingMedia]);

  const onDelete = useCallback(() => {
    setUploadingMedia(null);

    if (setUploadingPoster) {
      setUploadingPoster(null);
    }
  }, [setUploadingMedia]);

  const posterSource = useMemo(() => {
    return {
      uri: initialMedia?.posterStorageUrl,
    };
  }, [initialMedia?.posterStorageUrl]);

  const source = useMemo(() => {
    return {
      uri: initialMedia?.storageUrl,
    };
  }, [initialMedia?.storageUrl]);

  const introVideoView = useCallback(() => {
    return initialMedia && (initialMedia === uploadingMedia) ? (
      <View style={styles.videoContainer}>
        <Video
          posterSource={posterSource}
          source={source}
          width={uploadingMedia.width}
          height={uploadingMedia.height}
          duration={uploadingMedia.duration}
          viewable
        />
        <TouchableOpacity
          style={styles.bin}
          activeOpacity={0.7}
          onPress={onBinPress}
        >
          <Bin />
        </TouchableOpacity>
      </View>
    ) : (
      <UploadMediaButton
        label={t('ChangeBiography.introVideo')}
        handleMediaUpload={handleMediaUpload}
        mediaType={MEDIA_TYPES.VIDEO}
        style={styles.uploadButton}
        onDelete={onDelete}
      />
    );
  }, [initialMedia, uploadingMedia, posterSource, source, onBinPress, t, handleMediaUpload, onDelete]);

  return (
    <SafeAreaView style={styles.screen}>
      <Header
        title={(initialValue || initialMedia)
          ? t('ChangeBiography.changeBiography')
          : t('ChangeBiography.addBiography')}
        leftItemType="backArrow"
        rightItemType="text"
        rightItemText={t('ChangeBiography.save')}
        onRightItemPress={onPressSave}
        rightItemDisabled={isSaveButtonDisabled}
        {...saveButtonProps}
      />
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {!uploadingIntroVideo && introVideoView()}
        <Input
          label={t('ChangeBiography.biography')}
          value={value}
          onChange={setValue}
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
