import { StyleSheet } from 'react-native';

import hexToRgba from 'helpers/hexToRgba';

import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  button: {
    width: '100%',
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    alignSelf: 'center',
  },
  buttonTitle: {
    fontWeight: fonts.weight.bold,
    lineHeight: fonts.lineHeight.regular,
    fontSize: fonts.size.regular,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  primaryButtonTitle: {
    color: colors.white,
  },
  disabledPrimaryButton: {
    backgroundColor: hexToRgba(colors.primary, 0.4),
  },
  disabledPrimaryButtonTitle: {
    opacity: 0.4,
  },
  secondaryButton: {
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  secondaryButtonTitle: {
    color: colors.primary,
  },
  disabledSecondaryButton: {
    backgroundColor: colors.white,
  },
  disabledSecondaryButtonTitle: {
    color: colors.disabledText,
  },
});
