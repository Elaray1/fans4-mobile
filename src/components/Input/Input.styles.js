import { StyleSheet } from 'react-native';

import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  inputContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    height: 56,
    borderRadius: 5,
    paddingHorizontal: 16,
    marginTop: 6,
    marginBottom: 20,
    backgroundColor: colors.gray,
  },
  disabled: {
    backgroundColor: colors.disabledBackground,
    color: colors.disabledText,
    borderColor: colors.disabled,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  label: {
    color: colors.white,
    opacity: 0.4,
    fontSize: fonts.size.caption,
    fontWeight: fonts.weight.medium,
    lineHeight: fonts.lineHeight.caption,
  },
  labelFocused: {
    color: colors.primary,
  },
  error: {
    borderColor: colors.error,
  },
  errorMessage: {
    fontSize: fonts.size.caption,
    color: colors.error,
  },
  input: {
    flex: 1,
    color: colors.white,
    fontFamily: fonts.family.base,
    fontSize: fonts.size.small,
    fontWeight: fonts.weight.medium,
  },
});
