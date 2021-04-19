import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, Image } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import Text from 'components/Text';

import PaperclipIcon from 'assets/icons/paperclip.svg';
import RedBin from 'assets/icons/red-bin.svg';

import styles from './UploadPhotoButton.styles';

function UploadPhotoButton({ handleImageUpload, label }) {
  const [errorText, setErrorText] = useState(null);
  const [photo, setPhoto] = useState(null);

  const onEditProfilePicture = useCallback(async () => {
    const options = {
      mediaType: 'photo',
      cropping: true,
      cropperCircleOverlay: true,
      avoidEmptySpaceAroundImage: false,
      width: 335,
      height: 335,
      multiple: false,
      includeBase64: true,
    };

    try {
      const imageData = await ImagePicker.openPicker(options);
      setPhoto(imageData);
      handleImageUpload(imageData);
      setErrorText(null);
    } catch (error) {
      if (error.code === 'E_NO_LIBRARY_PERMISSION') {
        setErrorText('Please provide access to the library in mobile settings');
      }
    }
  }, [handleImageUpload]);

  const removePhoto = useCallback(() => {
    setPhoto(null);
  }, []);

  return (
    <View style={styles.buttonWrapper}>
      <Text style={styles.label}>{label}</Text>
      {photo?.data ? (
        <View>
          <Image
            style={styles.photoImage}
            source={{ uri: `data:${photo?.mime};base64,${photo?.data}` }}
          />
          <TouchableOpacity
            style={styles.redBin}
            activeOpacity={0.7}
            onPress={removePhoto}
          >
            <RedBin />
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <TouchableOpacity
            style={styles.button}
            onPress={onEditProfilePicture}
            activeOpacity={0.7}
          >
            <Text style={styles.text}>Upload</Text>
            <PaperclipIcon />
          </TouchableOpacity>
          {errorText && (
          <View style={styles.error}>
            <Text style={styles.errorText}>{errorText}</Text>
          </View>
          )}
        </>
      )}

    </View>

  );
}

UploadPhotoButton.propTypes = {
  label: PropTypes.string.isRequired,
  handleImageUpload: PropTypes.func.isRequired,
};

export default React.memo(UploadPhotoButton);
