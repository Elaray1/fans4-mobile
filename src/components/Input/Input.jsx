import PropTypes from 'prop-types';
import React, { useCallback, useState, useRef, useEffect, forwardRef } from 'react';
import {
  TextInput, View, Text as RNText, TouchableOpacity, Pressable, Platform,
} from 'react-native';
import getKeyboardType from 'helpers/getKeyboardType';

import Text from 'components/Text';
import Button from 'components/Button';

import colors from 'themes/colors';

import OpenedEyeIcon from 'assets/icons/opened-eye';
import ClosedEyeIcon from 'assets/icons/closed-eye';

import styles from './Input.styles';

function useForwardedRef(ref) {
  const innerRef = useRef(null);

  useEffect(() => {
    if (!ref) {
      return;
    }
    if (typeof ref === 'function') {
      ref(innerRef.current);
    }
    if (typeof ref === 'object') {
      ref.current = innerRef.current;
    }
  });

  return innerRef;
}

const Input = forwardRef(({
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
  style,
  multilineStyle,
  errorStyle,
  labelStyle,
  multiline,
  multilineSmall,
  numberOfLines,
  autoCapitalize,
  buttonTitle,
  onButtonPress,
  autoFocus,
  autogrowHeight,
}, ref) => {
  const inputRef = useForwardedRef(ref);

  const [focused, setFocused] = useState(autoFocus);
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    if (autoFocus && Platform.OS === 'android') {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const focusIfMulitlone = useCallback(() => {
    if (multiline && inputRef.current) {
      inputRef.current.focus();
    }
  }, [multiline, inputRef]);

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

      <Pressable
        onPress={focusIfMulitlone}
        style={[
          styles.inputContainer,
          focused && styles.inputFocused,
          !!errors.length && styles.error,
          disabled && !buttonTitle && styles.disabled,
          multiline && !multilineSmall && styles.inputContainerMultiline,
          autogrowHeight && styles.autogrowHeight,
        ]}
      >
        <TextInput
          ref={inputRef}
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
          style={[styles.input, multiline && styles.inputMultiline, multilineStyle]}
          maxLength={maxLength}
          multiline={multiline}
          autoCapitalize={autoCapitalize}
          numberOfLines={numberOfLines}
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
            style={styles.button}
            disabledTitleStyle={styles.disabledTitleStyle}
          />
        )}
      </Pressable>

      {!!errors.length
        && errors.map(error => (
          <Text key={error} style={[styles.errorMessage, errorStyle]}>
            {error}
          </Text>
        ))}
    </View>
  );
});

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
  multilineStyle: PropTypes.shape(),
  labelStyle: RNText.propTypes.style,
  errorStyle: RNText.propTypes.style,
  blurOnSubmit: PropTypes.bool,
  onSubmitEditing: PropTypes.func,
  maxLength: PropTypes.number,
  multiline: PropTypes.bool,
  numberOfLines: PropTypes.number,
  buttonTitle: PropTypes.string,
  onButtonPress: PropTypes.func,
  autoFocus: PropTypes.bool,
  multilineSmall: PropTypes.bool,
  autogrowHeight: PropTypes.bool,
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
  blurOnSubmit: true,
  onSubmitEditing: null,
  maxLength: null,
  style: {},
  multilineStyle: {},
  labelStyle: {},
  errorStyle: {},
  multiline: false,
  numberOfLines: 1,
  buttonTitle: '',
  onButtonPress: () => null,
  autoFocus: false,
  multilineSmall: false,
  autogrowHeight: false,
};

export default React.memo(Input);
