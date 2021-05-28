import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';

import FailureToastIcon from 'assets/icons/failureToast.svg';

import styles from './styles';

const FailureToast = ({ text }) => {
  return (
    <View style={styles.container}>
      <FailureToastIcon />
      <Text style={styles.text}>
        {text}
      </Text>
    </View>
  );
};

FailureToast.propTypes = {
  text: PropTypes.string.isRequired,
};

export default React.memo(FailureToast);
