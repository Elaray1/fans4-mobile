import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';

import SuccessToastIcon from 'assets/icons/successToast.svg';

import styles from './styles';

const SuccessToast = ({ text }) => {
  return (
    <View style={styles.container}>
      <SuccessToastIcon />
      <Text style={styles.text}>
        {text}
      </Text>
    </View>
  );
};

SuccessToast.propTypes = {
  text: PropTypes.string.isRequired,
};

export default React.memo(SuccessToast);
