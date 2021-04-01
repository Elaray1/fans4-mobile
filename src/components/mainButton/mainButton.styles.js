import { StyleSheet } from 'react-native';

import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  button: {
    width: '100%',
    height: 54,
    backgroundColor: colors.white,
    marginBottom: 16,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: colors.font,
    fontWeight: fonts.weight.bold,
    fontSize: fonts.size.subtitle,
  },
});
