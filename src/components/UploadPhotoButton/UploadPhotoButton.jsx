import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import Text from 'components/Text';

import PaperclipIcon from 'assets/icons/paperclip.svg';

import styles from './UploadPhotoButton.styles';

function UploadPhotoButton({ handleImageUpload, label }) {
  const onEditProfilePicture = useCallback(async () => {
    const options = {
      mediaType: 'photo',
      cropping: true,
      cropperCircleOverlay: true,
      avoidEmptySpaceAroundImage: false,
      width: 500,
      height: 500,
      multiple: false,
    };
    const imageData = await ImagePicker.openPicker(options);
    handleImageUpload(imageData);
  }, [handleImageUpload]);

  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.button} onPress={onEditProfilePicture}>
        <Text style={styles.text}>Upload</Text>
        <PaperclipIcon />
      </TouchableOpacity>
    </>
  );
}

UploadPhotoButton.propTypes = {
  handleImageUpload: PropTypes.func.isRequired,
  label: PropTypes.string,
};

UploadPhotoButton.defaultProps = {
  label: '',
};

export default React.memo(UploadPhotoButton);
