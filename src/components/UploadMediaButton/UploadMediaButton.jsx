import React, { useCallback, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, Image, Alert, Platform, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import ImagePicker from 'react-native-image-crop-picker';
import analyticsService from 'services/analytics.service';
import _ from 'lodash';

import PaperclipIcon from 'assets/icons/paperclip.svg';
import Bin from 'assets/icons/bin.svg';

import Viewable from 'components/Viewable';
import Modal from 'components/Modal';
import Video from 'components/Video';
import Text from 'components/Text';

import useToast from 'hooks/useToast';

import UploadingMethodModal from './components/UploadingMethodModal';

import styles from './UploadMediaButton.styles';
import { MEDIA_TYPES } from './UploadMediaButton.constants';

const WIDTH_HEIGHT_RATIO = 0.8;
const HEIGHT_WIDTH_RATIO = 1.25;

const smartAlbums = ['UserLibrary', 'Panoramas', 'Videos', 'Bursts']; // default library albums except "PhotoStream"
function UploadMediaButton({
  handleMediaUpload,
  onDelete,
  label,
  mediaType,
  croppingAvatar,
  canUploadFromCamera,
  style,
}) {
  const { showFailure } = useToast();
  const { t } = useTranslation();

  const [media, setMedia] = useState(null);
  const [errorText, setErrorText] = useState(null);

  const [isChooseUploadingMethodModal, setIsChooseUploadingMethodModal] = useState(false);
  const [allowModalData, setAllowModalData] = useState(null); // { title, text }

  const videoSource = useMemo(() => {
    if (!media) {
      return null;
    }

    return { uri: media.path };
  }, [media]);

  const onOpenUploadingMethodModal = useCallback(() => {
    setIsChooseUploadingMethodModal(true);
  }, []);

  const onCloseUploadingMethodModal = useCallback(() => {
    setIsChooseUploadingMethodModal(false);
  }, []);

  const onNewMediaSet = useCallback((mediaData) => {
    handleMediaUpload(mediaData);
    setMedia(mediaData);
    setErrorText(null);
  }, [handleMediaUpload]);

  const handleCameraError = useCallback((error) => {
    console.log(error.code);

    if (error.code === 'E_NO_CAMERA_PERMISSION') {
      setAllowModalData({
        title: t('UploadMediaButton.accessToCameraNeeded'),
        text: t('UploadMediaButton.provideAccessToTheCamera'),
      });

      return;
    }
    if (error.code === 'E_PICKER_CANCELLED') {
      return;
    }

    showFailure();
    console.log('media button error:', error);
  }, [showFailure, t]);

  const onUploadFromGallery = useCallback(async () => {
    const options = croppingAvatar ? {
      cropping: Platform.OS === 'android' ? true : 'cropit',
      mediaType: MEDIA_TYPES.PHOTO,
      cropperCircleOverlay: true,
      avoidEmptySpaceAroundImage: false,
      width: 335,
      height: 335,
      multiple: false,
      forceJpg: true,
      smartAlbums,
    } : {
      mediaType,
      compressVideoPreset: 'Passthrough',
      multiple: false,
      writeTempFile: false,
      smartAlbums,
    };

    try {
      let mediaData = await ImagePicker.openPicker(options);
      mediaData.path = Platform.OS === 'ios' ? mediaData.sourceURL : mediaData.path;

      if (mediaData.mime.includes('image')) {
        const { width, height, path } = mediaData;

        if (width / height < WIDTH_HEIGHT_RATIO || croppingAvatar) {
          const croppedHeight = width * HEIGHT_WIDTH_RATIO;

          mediaData = await ImagePicker.openCropper({
            cropperCircleOverlay: !!croppingAvatar,
            path,
            height: !croppingAvatar ? croppedHeight : 335,
            width: !croppingAvatar ? width : 335,
          });
        }
      } else {
        mediaData.duration = parseInt(mediaData.duration / 1000, 10);
      }

      onNewMediaSet(mediaData);
    } catch (error) {
      console.log('media button error:', error);

      if (error.code === 'E_NO_LIBRARY_PERMISSION') {
        setErrorText(t('UploadMediaButton.provideAccessToTheLibrary'));

        setAllowModalData({
          title: t('UploadMediaButton.accessToGalleryNeeded'),
          text: t('UploadMediaButton.provideAccessToTheLibrary'),
        });
      }
    }

    analyticsService.logEvent({
      name: analyticsService.events.FIGHTER_UPLOAD_MEDIA_FROM_GALLERY,
    });

    onCloseUploadingMethodModal(false);
  }, [onNewMediaSet, t, mediaType, croppingAvatar, onCloseUploadingMethodModal]);

  const onUploadPhotoFromCamera = useCallback(async () => {
    const options = {
      mediaType: MEDIA_TYPES.PHOTO,
    };

    try {
      let mediaData = await ImagePicker.openCamera(options);

      const { width, height, path } = mediaData;

      if (width / height < WIDTH_HEIGHT_RATIO) {
        const croppedHeight = width * HEIGHT_WIDTH_RATIO;

        mediaData = await ImagePicker.openCropper({
          path,
          height: croppedHeight,
          width,
        });
      }

      handleMediaUpload(mediaData);
      setMedia(mediaData);

      setErrorText(null);
    } catch (error) {
      console.log(error);
      handleCameraError(error);
    }

    analyticsService.logEvent({
      name: analyticsService.events.FIGHTER_UPLOAD_PHOTO_FROM_CAMERA,
    });

    onCloseUploadingMethodModal(false);
  }, [handleCameraError, onCloseUploadingMethodModal, handleMediaUpload]);

  const onUploadVideoFromCamera = useCallback(async () => {
    const options = {
      mediaType: MEDIA_TYPES.VIDEO,
      compressVideoPreset: 'Passthrough',
    };

    try {
      const mediaData = await ImagePicker.openCamera(options);
      mediaData.path = Platform.OS === 'ios' ? mediaData.sourceURL : mediaData.path;
      mediaData.duration = parseInt(mediaData.duration / 1000, 10);

      onNewMediaSet(mediaData);
    } catch (error) {
      handleCameraError(error);
    }

    analyticsService.logEvent({
      name: analyticsService.events.FIGHTER_UPLOAD_VIDEO_FROM_CAMERA,
    });

    onCloseUploadingMethodModal(false);
  }, [handleCameraError, onNewMediaSet, onCloseUploadingMethodModal]);

  const onCloseAllowModal = useCallback(() => {
    setAllowModalData(null);
  }, []);

  const onGoToSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  const onBinPress = useCallback(() => {
    Alert.alert(
      t('UploadMediaButton.deleteMedia'),
      t('UploadMediaButton.uploadedMediaWillBeDeleted'),
      [
        {
          text: t('UploadMediaButton.cancel'),
          style: 'cancel',
        },
        {
          text: t('UploadMediaButton.delete'),
          style: 'default',
          onPress: () => {
            setMedia(null);
            onDelete();
          },
        }],
    );
  }, [onDelete, t]);

  let contentView = null;

  if (!media) {
    contentView = (
      <>
        <TouchableOpacity
          style={styles.button}
          onPress={canUploadFromCamera ? onOpenUploadingMethodModal : onUploadFromGallery}
          activeOpacity={0.7}
        >
          <Text style={styles.text}>{t('UploadMediaButton.upload')}</Text>
          <PaperclipIcon />
        </TouchableOpacity>

        {errorText && (
          <View style={styles.error}>
            <Text style={styles.errorText}>{errorText}</Text>
          </View>
        )}
      </>
    );
  } else if (_.includes(media.mime, 'image')) {
    contentView = (
      <View>
        <Image
          style={[styles.photoImage, { aspectRatio: media.width / media.height }]}
          source={{ uri: media.path }}
        />

        <TouchableOpacity
          style={styles.bin}
          activeOpacity={0.7}
          onPress={onBinPress}
        >
          <Bin />
        </TouchableOpacity>
      </View>
    );
  } else {
    contentView = (
      <View>
        <Viewable>
          <Video
            source={videoSource}
            width={media.width}
            height={media.height}
            duration={media.duration}
          />
        </Viewable>
        <TouchableOpacity
          style={styles.bin}
          activeOpacity={0.7}
          onPress={onBinPress}
        >
          <Bin />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      {isChooseUploadingMethodModal && (
        <UploadingMethodModal
          visible={isChooseUploadingMethodModal}
          onClose={onCloseUploadingMethodModal}
          onUploadFromGallery={onUploadFromGallery}
          onUploadPhotoFromCamera={onUploadPhotoFromCamera}
          onUploadVideoFromCamera={onUploadVideoFromCamera}
        />
      )}
      {allowModalData && (
        <Modal
          title={allowModalData.title}
          text={allowModalData.text}
          closeButtonText={t('UploadMediaButton.cancel')}
          submitButtonText={t('UploadMediaButton.goToSettings')}
          onClose={onCloseAllowModal}
          onSubmit={onGoToSettings}
        />
      )}
      <View style={[styles.buttonWrapper, style]}>
        <Text style={styles.label}>{label}</Text>
        {contentView}
      </View>
    </>
  );
}

UploadMediaButton.propTypes = {
  label: PropTypes.string.isRequired,
  handleMediaUpload: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  mediaType: PropTypes.oneOf([...Object.values(MEDIA_TYPES)]),
  croppingAvatar: PropTypes.bool,
  canUploadFromCamera: PropTypes.bool,
  style: PropTypes.shape(),
};

UploadMediaButton.defaultProps = {
  mediaType: MEDIA_TYPES.ANY,
  croppingAvatar: false,
  canUploadFromCamera: false,
  style: {},
};

export default React.memo(UploadMediaButton);
