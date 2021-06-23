import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import {
  TextInput, View, Text as RNText, TouchableOpacity,
} from 'react-native';
import getKeyboardType from 'helpers/getKeyboardType';

import Text from 'components/Text';
import Button from 'components/Button';

import colors from 'themes/colors';

import OpenedEyeIcon from 'assets/icons/opened-eye';
import ClosedEyeIcon from 'assets/icons/closed-eye';

import styles from './Input.styles';

const DEFAULT_INPUT_CONTENT_SIZE_HEIGHT = 27.7;

function Input({
  type,
  label,
  onChange,
  maxLength,
  disabled,
  placeholder,
  blurOnSubmit,
  onFocus,
  onBlur,
  onSubmitEditing,
  value,
  errors,
  returnKeyType,
  getRef,
  style,
  errorStyle,
  labelStyle,
  multiline,
  numberOfLines,
  autoCapitalize,
  buttonTitle,
  onButtonPress,
  autoFocus,
}) {
  const [focused, setFocused] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [inputContentSizeHeight, setInputContentSizeHeight] = useState(DEFAULT_INPUT_CONTENT_SIZE_HEIGHT);

  const handleFocus = useCallback(() => {
    setFocused(true);
    onFocus();
  }, [setFocused, onFocus]);

  const handleBlur = useCallback(() => {
    setFocused(false);
    onBlur();
  }, [onBlur, setFocused]);

  const onChangePasswordVisibility = useCallback(() => {
    setPasswordVisible(!isPasswordVisible);
  }, [isPasswordVisible]);

  const onContentSizeChange = useCallback((event) => {
    setInputContentSizeHeight(event.nativeEvent.contentSize.height);
  }, []);

  return (
    <View style={style}>
      {label && (
      <Text
        style={[
          styles.label,
          labelStyle,
          focused && styles.labelFocused,
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
          disabled && !buttonTitle && styles.disabled,
          multiline && styles.inputContainerMultiline,
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
          style={[styles.input, multiline && styles.inputMultiline]}
          maxLength={maxLength}
          multiline={multiline}
          autoCapitalize={autoCapitalize}
          numberOfLines={numberOfLines}
          onContentSizeChange={onContentSizeChange}
          autoFocus={autoFocus}
        />
        {type === 'password' && (
        <TouchableOpacity
          onPress={onChangePasswordVisibility}
          style={styles.passwordIcon}
          disabled={disabled}
        >
          {disabled && <ClosedEyeIcon stroke={colors.disabledText} />}
          {!disabled && !isPasswordVisible && <ClosedEyeIcon />}
          {!disabled && isPasswordVisible && <OpenedEyeIcon />}
        </TouchableOpacity>
        )}
        {Boolean(buttonTitle) && (
        <Button
          type="link"
          title={buttonTitle}
          onPress={onButtonPress}
          disabled={!value || disabled}
          titleStyle={styles.buttonTitle}
          style={[
            styles.button,
            Boolean(inputContentSizeHeight > DEFAULT_INPUT_CONTENT_SIZE_HEIGHT) && styles.multilineButtonStyles,
          ]}
          disabledTitleStyle={styles.disabledTitleStyle}
        />
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
  autoCapitalize: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  errors: PropTypes.arrayOf(PropTypes.string),
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  returnKeyType: PropTypes.string,
  style: PropTypes.shape(),
  labelStyle: RNText.propTypes.style,
  errorStyle: RNText.propTypes.style,
  getRef: PropTypes.shape(),
  blurOnSubmit: PropTypes.bool,
  onSubmitEditing: PropTypes.func,
  maxLength: PropTypes.number,
  multiline: PropTypes.bool,
  numberOfLines: PropTypes.number,
  buttonTitle: PropTypes.string,
  onButtonPress: PropTypes.func,
  autoFocus: PropTypes.bool,
};

Input.defaultProps = {
  autoCapitalize: 'sentences',
  type: 'none',
  label: null,
  value: '',
  placeholder: '',
  disabled: false,
  errors: [],
  onFocus: () => null,
  onBlur: () => null,
  returnKeyType: 'done',
  getRef: { current: null },
  blurOnSubmit: true,
  onSubmitEditing: null,
  maxLength: null,
  style: {},
  labelStyle: {},
  errorStyle: {},
  multiline: false,
  numberOfLines: 1,
  buttonTitle: '',
  onButtonPress: () => null,
  autoFocus: false,
};

export default Input;
