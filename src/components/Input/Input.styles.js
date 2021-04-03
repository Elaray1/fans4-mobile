import { StyleSheet } from 'react-native';

import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  inputContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    height: 46,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: colors.disabledText,
    paddingHorizontal: 8,
    marginVertical: 2,
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
    fontSize: fonts.size.regular,
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
    color: colors.black,
    fontFamily: fonts.family.base,
    fontSize: fonts.size.regular,
    fontWeight: fonts.weight.regular,
  },
});
