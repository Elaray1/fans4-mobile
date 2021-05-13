import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity, ViewPropTypes, Text,
} from 'react-native';

import CheckMark from 'assets/icons/check-mark.svg';

import styles from './Checkbox.styles';

function Checkbox({
  value,
  onChangeValue,
  label,
  style,
  labelStyle,
}) {
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onChangeValue}
      style={[styles.checkboxWrapper, style]}
    >
      <TouchableOpacity
        style={[
          styles.checkbox,
          value && styles.activeCheckbox,
        ]}
        onPress={onChangeValue}
      >
        {value && <CheckMark />}
      </TouchableOpacity>
      <Text
        style={[styles.label, labelStyle]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

Checkbox.propTypes = {
  value: PropTypes.bool,
  onChangeValue: PropTypes.func,
  label: PropTypes.string,
  style: ViewPropTypes.style,
  labelStyle: Text.propTypes.style,
};

Checkbox.defaultProps = {
  value: false,
  onChangeValue: () => null,
  label: '',
  style: {},
  labelStyle: {},
};

export default Checkbox;
