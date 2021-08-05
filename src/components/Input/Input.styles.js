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
  // Currently used only for screen Comments
  autogrowHeight: {
    height: 'auto',
    paddingVertical: 10,
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
    color: colors.grayText,
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
    position: 'absolute',
    bottom: -17,
    left: 0,
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
    paddingTop: 15,
    paddingBottom: 10,
    height: 120,
  },
  inputMultiline: {
    paddingVertical: 0,
    textAlignVertical: 'top',
  },
  buttonTitle: {
    color: colors.primary,
    textDecorationLine: 'none',
  },
  button: {
    marginLeft: 20,
  },
  disabledTitleStyle: {
    opacity: 0.5,
  },
});
