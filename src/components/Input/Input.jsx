import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import {
  TextInput, View, Text as RNText, TouchableOpacity,
} from 'react-native';
import getKeyboardType from 'helpers/getKeyboardType';

import Text from 'components/Text';

import colors from 'themes/colors';

import OpenedEyeIcon from 'assets/icons/opened-eye.svg';
import ClosedEyeIcon from 'assets/icons/closed-eye.svg';

import styles from './Input.styles';

function Input({
  type,
  label,
  onChange,
  maxLength,
  disabled,
  placeholder,
  blurOnSubmit,
  onBlur,
  onSubmitEditing,
  value,
  errors,
  returnKeyType,
  getRef,
  errorStyle,
  labelStyle,
}) {
  const [focused, setFocused] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const handleFocus = useCallback(() => {
    setFocused(true);
  }, [setFocused]);

  const handleBlur = useCallback(() => {
    setFocused(false);
    onBlur();
  }, [onBlur, setFocused]);

  const onChangePasswordVisibility = useCallback(() => {
    setPasswordVisible(!isPasswordVisible);
  }, [isPasswordVisible]);

  return (
    <View>
      {label && (
      <Text
        style={[
          styles.label,
          labelStyle,
          focused && styles.labelFocused,
          !!errors.length && styles.errorMessage,
          errorStyle,
          disabled && styles.disabled,
        ]}
      >
        {label}
      </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          focused && styles.inputFocused,
          !!errors.length && styles.error,
          disabled && styles.disabled,
        ]}
      >
        <TextInput
          ref={getRef}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={colors.disabledText}
          textContentType={type}
          blurOnSubmit={blurOnSubmit}
          focused={focused}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          onSubmitEditing={onSubmitEditing}
          onChangeText={onChange}
          secureTextEntry={type === 'password' && !isPasswordVisible}
          keyboardType={getKeyboardType(type)}
          returnKeyType={returnKeyType}
          style={styles.input}
          maxLength={maxLength}
        />
        {type === 'password' && (
        <TouchableOpacity
          onPress={onChangePasswordVisibility}
          style={styles.passwordIcon}
          disabled={disabled}
        >
          {disabled && <ClosedEyeIcon stroke={colors.disabledText} />}
          {!disabled && isPasswordVisible && <ClosedEyeIcon />}
          {!disabled && !isPasswordVisible && <OpenedEyeIcon />}
        </TouchableOpacity>
        )}
      </View>
      {!!errors.length
      && errors.map(error => (
        <Text key={error} style={[styles.errorMessage, errorStyle]}>
          {error}
        </Text>
      ))}
    </View>
  );
}

Input.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  errors: PropTypes.arrayOf(PropTypes.string),
  onBlur: PropTypes.func,
  returnKeyType: PropTypes.string,
  labelStyle: RNText.propTypes.style,
  errorStyle: RNText.propTypes.style,
  getRef: PropTypes.shape(),
  blurOnSubmit: PropTypes.bool,
  onSubmitEditing: PropTypes.func,
  maxLength: PropTypes.number,
};

Input.defaultProps = {
  type: 'none',
  label: null,
  value: '',
  placeholder: '',
  disabled: false,
  errors: [],
  onBlur: () => {},
  returnKeyType: 'done',
  getRef: { current: null },
  blurOnSubmit: true,
  onSubmitEditing: null,
  maxLength: null,
  labelStyle: {},
  errorStyle: {},
};

export default Input;
