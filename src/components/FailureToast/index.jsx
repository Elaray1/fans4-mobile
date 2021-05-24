import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import PropTypes from 'prop-types';

import { variables } from 'themes/commonStyles';
import FailureToastIcon from 'assets/icons/failureToast.svg';

import styles from './styles';

const FailureToast = ({ text }) => {
  const { width: windowWidth } = useWindowDimensions();

  return (
    <View style={[styles.container, { width: windowWidth - variables.paddingHorizontal * 2 }]}>
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
