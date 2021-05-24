import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import PropTypes from 'prop-types';

import { variables } from 'themes/commonStyles';
import SuccessToastIcon from 'assets/icons/successToast.svg';

import styles from './styles';

const SuccessToast = ({ text }) => {
  const { width: windowWidth } = useWindowDimensions();

  return (
    <View style={[styles.container, { width: windowWidth - variables.paddingHorizontal * 2 }]}>
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
