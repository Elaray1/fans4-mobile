import React, { useCallback, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import Text from 'components/Text';

import styles from './UploadPhotoButton.styles';

function UploadPhotoButton() {
  const [photo, setPhoto] = useState(null);

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
    ImagePicker.openPicker(options).then((image) => {
      setPhoto(image);
    });
  }, []);

  return (
    <TouchableOpacity style={styles.button} onPress={onEditProfilePicture}>
      <Text>Upload</Text>
    </TouchableOpacity>
  );
}

export default UploadPhotoButton;
