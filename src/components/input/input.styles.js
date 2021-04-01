import { StyleSheet } from 'react-native';

import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
    width: '100%',
  },
  input: {
    padding: 14,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    borderColor: colors.border,
    fontSize: fonts.size.regular,
    color: colors.white,
  },
  placeholder: {
    color: colors.gray,
  },
  error: {
    ...fonts.style.error,
    position: 'absolute',
    bottom: -14,
    left: 8,
  },
});
