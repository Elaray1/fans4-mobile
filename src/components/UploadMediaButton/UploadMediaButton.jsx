import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  View,
  Image,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import ImagePicker from 'react-native-image-crop-picker';
import Video from 'components/Video';
import Text from 'components/Text';
import _ from 'lodash';

import PaperclipIcon from 'assets/icons/paperclip.svg';
import RedBin from 'assets/icons/red-bin.svg';

import styles from './UploadMediaButton.styles';
import { MEDIA_TYPES } from './UploadMediaButton.constants';

function UploadMediaButton({
  handleMediaUpload,
  label,
  mediaType,
  croppingAvatar,
}) {
  const { t } = useTranslation();

  const [errorText, setErrorText] = useState(null);
  const [media, setMedia] = useState(null);

  const onEditProfilePicture = useCallback(async () => {
    const options = croppingAvatar ? {
      cropping: true,
      mediaType: MEDIA_TYPES.PHOTO,
      cropperCircleOverlay: true,
      avoidEmptySpaceAroundImage: false,
      width: 335,
      height: 335,
      multiple: false,
    } : {
      mediaType,
      multiple: false,
    };

    try {
      let mediaData = await ImagePicker.openPicker(options);

      if (mediaData.mime.includes('image') && !croppingAvatar) {
        const { width, height, path } = mediaData;

        if (width / height < 0.8) {
          const croppedHeight = width * 5 / 4;
          mediaData = await ImagePicker.openCropper({
            path,
            height: croppedHeight,
            width,
          });
        }
      }

      setMedia(mediaData);
      handleMediaUpload(mediaData);

      setErrorText(null);
    } catch (error) {
      console.log('media button error:', error);

      if (error.code === 'E_NO_LIBRARY_PERMISSION') {
        setErrorText(t('uploadMediaButton.provideAccessToTheLibrary'));
      }
    }
  }, [handleMediaUpload, t, mediaType, croppingAvatar]);

  const onBinPress = useCallback(() => {
    Alert.alert(
      t('uploadMediaButton.deleteMedia'),
      t('uploadMediaButton.uploadedMediaWillBeDeleted'),
      [
        {
          text: t('uploadMediaButton.cancel'),
          style: 'cancel',
        },
        {
          text: t('uploadMediaButton.delete'),
          style: 'default',
          onPress: () => setMedia(null),
        }],
    );
  }, [t]);

  let contentView = null;

  if (!media) {
    contentView = (
      <>
        <TouchableOpacity
          style={styles.button}
          onPress={onEditProfilePicture}
          activeOpacity={0.7}
        >
          <Text style={styles.text}>{t('uploadMediaButton.upload')}</Text>
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
          style={styles.redBin}
          activeOpacity={0.7}
          onPress={onBinPress}
        >
          <RedBin />
        </TouchableOpacity>
      </View>
    );
  } else {
    contentView = (
      <View>
        <Video source={{ uri: media.path }} aspectRatio={media.width / media.height} />
        <TouchableOpacity
          style={styles.redBin}
          activeOpacity={0.7}
          onPress={onBinPress}
        >
          <RedBin />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.buttonWrapper}>
      <Text style={styles.label}>{label}</Text>
      {contentView}
    </View>
  );
}

UploadMediaButton.defaultProps = {
  mediaType: MEDIA_TYPES.ANY,
  croppingAvatar: false,
};

UploadMediaButton.propTypes = {
  label: PropTypes.string.isRequired,
  handleMediaUpload: PropTypes.func.isRequired,
  mediaType: PropTypes.oneOf([...Object.values(MEDIA_TYPES)]),
  croppingAvatar: PropTypes.bool,
};

export default React.memo(UploadMediaButton);
