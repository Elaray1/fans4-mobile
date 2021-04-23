import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
} from 'react-native';

import Text from 'components/Text';

import RadioButtonIcon from 'assets/icons/radio-button';
import RadioButtonSelectedIcon from 'assets/icons/radio-button-selected';

import styles from './RadioButton.styles';

function RadioButton({ isSelected, title, onPress }) {
  return (
    <TouchableOpacity style={[styles.container, isSelected && styles.selected]} onPress={onPress}>
      {isSelected ? <RadioButtonSelectedIcon style={{ marginRight: 12 }} />
        : <RadioButtonIcon style={{ marginRight: 12 }} />}
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

RadioButton.propTypes = {
  isSelected: PropTypes.bool,
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

RadioButton.defaultProps = {
  isSelected: false,
};

export default React.memo(RadioButton);
