import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import Text from 'components/Text';

import styles from './UploadPhotoButton.styles';

function UploadPhotoButton({ handleImageUpload }) {
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
    <TouchableOpacity style={styles.button} onPress={onEditProfilePicture}>
      <Text>Upload</Text>
    </TouchableOpacity>
  );
}

UploadPhotoButton.propTypes = {
  handleImageUpload: PropTypes.func.isRequired,
};

export default React.memo(UploadPhotoButton);
