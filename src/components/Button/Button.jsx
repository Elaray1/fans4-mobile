import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, ActivityIndicator } from 'react-native';

import hexToRgba from 'helpers/hexToRgba';

import Text from 'components/Text';

import colors from 'themes/colors';

import { TYPES } from './Button.constants';

import styles from './Button.styles';


function Button({
  type,
  title,
  onPress,
  disabled,
  style,
  titleStyle,
  isLoading,
  disableWithoutFade,
}) {
  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={isDisabled || disableWithoutFade}
      style={[
        type !== TYPES.LINK && styles.button,
        type === TYPES.PRIMARY && styles.primaryButton,
        type === TYPES.SECONDARY && styles.secondaryButton,
        isDisabled && type === TYPES.PRIMARY && styles.disabledPrimaryButton,
        isDisabled && type === TYPES.SECONDARY && styles.disabledSecondaryButton,
        style,
      ]}
    >
      {isLoading ? <ActivityIndicator size="large" color={hexToRgba(colors.white, 0.4)} /> : (
        <Text
          style={[
            type !== TYPES.LINK && styles.buttonTitle,
            type === TYPES.PRIMARY && styles.primaryButtonTitle,
            type === TYPES.SECONDARY && styles.secondaryButtonTitle,
            type === TYPES.LINK && styles.link,
            isDisabled && type === TYPES.PRIMARY && styles.disabledPrimaryButtonTitle,
            isDisabled && type === TYPES.SECONDARY && styles.disabledSecondaryButtonTitle,
            titleStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

Button.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]).isRequired,
  onPress: PropTypes.func,
  style: PropTypes.shape(),
  titleStyle: Text.propTypes.style,
  disabled: PropTypes.bool,
  disableWithoutFade: PropTypes.bool,
  isLoading: PropTypes.bool,
  type: PropTypes.oneOf(Object.values(TYPES)),
};

Button.defaultProps = {
  onPress: () => null,
  disabled: false,
  disableWithoutFade: false,
  isLoading: false,
  style: {},
  titleStyle: {},
  type: TYPES.PRIMARY,
};

export default React.memo(Button);
