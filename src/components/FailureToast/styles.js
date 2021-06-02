import { StyleSheet } from 'react-native';

import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
    backgroundColor: colors.gray,
    borderColor: colors.error,
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginLeft: 10,
    color: colors.white,
    fontSize: fonts.size.small,
    fontWeight: fonts.weight.medium,
  },
});
