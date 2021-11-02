import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';

import ErrorIcon from 'assets/icons/error.svg';

import styles from './styles';

const FailureToast = ({ text }) => {
  return (
    <View style={styles.container}>
      <ErrorIcon />
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
