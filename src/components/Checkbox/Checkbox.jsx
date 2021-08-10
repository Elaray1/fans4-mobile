import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity, ViewPropTypes,
} from 'react-native';

import Text from 'components/Text';

import CheckMark from 'assets/icons/check-mark.svg';

import styles from './Checkbox.styles';

function Checkbox({
  value,
  onChangeValue,
  disabled,
  label,
  style,
  labelStyle,
}) {
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onChangeValue}
      disabled={disabled}
      style={[styles.checkboxWrapper, style]}
    >
      <TouchableOpacity
        style={[
          styles.checkbox,
          value && styles.activeCheckbox,
          disabled && styles.disabled,
        ]}
        onPress={onChangeValue}
        disabled={disabled}
      >
        {value && <CheckMark />}
      </TouchableOpacity>
      <Text style={[styles.label, disabled && styles.disabled, labelStyle]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

Checkbox.propTypes = {
  value: PropTypes.bool,
  onChangeValue: PropTypes.func,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  style: ViewPropTypes.style,
  labelStyle: Text.propTypes.style,
};

Checkbox.defaultProps = {
  value: false,
  onChangeValue: () => null,
  disabled: false,
  label: '',
  style: {},
  labelStyle: {},
};

export default React.memo(Checkbox);
