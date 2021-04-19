import { StyleSheet } from 'react-native';

import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 36,
    borderRadius: 5,
    paddingHorizontal: 11,
    backgroundColor: colors.gray,
  },
  disabled: {
    backgroundColor: colors.disabledBackground,
    color: colors.disabledText,
  },
  inputFocused: {
  },
  input: {
    marginLeft: 5,
    height: 36,
    paddingVertical: 0,
    flex: 1,
    color: colors.white,
    fontSize: fonts.size.small,
    fontFamily: fonts.family.base,
    fontWeight: fonts.weight.medium,
  },
});
