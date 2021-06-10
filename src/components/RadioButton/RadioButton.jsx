import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
} from 'react-native';

import Text from 'components/Text';

import RadioButtonIcon from 'assets/icons/radio-button';
import RadioButtonSelectedIcon from 'assets/icons/radio-button-selected';

import styles from './RadioButton.styles';

function RadioButton({
  isSelected, title, onPress, style,
}) {
  return (
    <TouchableOpacity style={[styles.container, isSelected && styles.selected, style]} onPress={onPress}>
      {isSelected
        ? <RadioButtonSelectedIcon style={styles.radioButtonIcon} />
        : <RadioButtonIcon style={styles.radioButtonIcon} />
      }
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

RadioButton.propTypes = {
  isSelected: PropTypes.bool,
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.shape(),
};

RadioButton.defaultProps = {
  isSelected: false,
  style: {},
};

export default React.memo(RadioButton);
