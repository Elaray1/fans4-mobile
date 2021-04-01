import PropTypes from 'prop-types';
import React from 'react';
import { TouchableOpacity, Image } from 'react-native';

import images from 'themes/images';

import styles from './backButton.styles';

function MainButton({ onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.button}
    >
      <Image
        source={images.backButton}
        style={styles.button}
        resizeMode="stretch"
      />
    </TouchableOpacity>
  );
}

MainButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default MainButton;
