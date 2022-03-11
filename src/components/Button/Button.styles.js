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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTitle: {
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
    lineHeight: fonts.lineHeight.regular,
    fontSize: fonts.size.regular,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  primaryButtonTitle: {
    color: colors.primaryButtonText,
  },
  disabledPrimaryButton: {
    backgroundColor: hexToRgba(colors.primary, 0.4),
  },
  doneButton: {
    backgroundColor: hexToRgba(colors.primary, 0.12),
  },
  doneButtonTitle: {
    color: colors.primary,
    fontSize: fonts.size.caption,
    fontFamily: fonts.family.base,
    fontWeight: fonts.weight.medium,
    lineHeight: fonts.lineHeight.small,
  },
  secondaryButton: {
    borderColor: colors.primary,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  secondaryButtonTitle: {
    color: colors.primary,
  },
  disabledSecondaryButton: {
    borderColor: hexToRgba(colors.primary, 0.4),
  },
  disabledSecondaryButtonTitle: {
    color: colors.disabledText,
  },
  link: {
    textDecorationLine: 'underline',
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
    fontSize: fonts.size.small,
  },
});
