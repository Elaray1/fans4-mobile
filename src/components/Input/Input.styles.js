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
    marginBottom: 5,
    backgroundColor: colors.gray,
  },
  disabled: {
    backgroundColor: colors.disabledBackground,
    color: colors.disabledText,
    borderColor: colors.disabled,
  },
  inputFocused: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
  label: {
    color: colors.white,
    opacity: 0.4,
    fontSize: fonts.size.caption,
    fontFamily: fonts.family.base,
    fontWeight: fonts.weight.medium,
    lineHeight: fonts.lineHeight.caption,
  },
  error: {
    borderWidth: 1,
    borderColor: colors.error,
  },
  errorMessage: {
    fontSize: fonts.size.caption,
    color: colors.error,
  },
  input: {
    paddingHorizontal: 0,
    flex: 1,
    color: colors.white,
    fontSize: fonts.size.small,
    fontFamily: fonts.family.base,
    fontWeight: fonts.weight.medium,
  },
  inputContainerMultiline: {
    alignItems: 'flex-start',
    paddingVertical: 18,
  },
  inputMultiline: {
    paddingVertical: 0,
    textAlignVertical: 'top',
  },
});
