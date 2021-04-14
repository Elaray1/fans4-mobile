import { StyleSheet } from 'react-native';

import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  inputContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: colors.disabledText,
    paddingHorizontal: 14,
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
  input: {
    flex: 1,
    marginLeft: 10,
    color: colors.white,
    fontFamily: fonts.family.base,
    fontSize: fonts.size.regular,
    fontWeight: fonts.weight.regular,
  },
});
