import { StyleSheet } from 'react-native';

import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  container: {
    backgroundColor: colors.gray,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 40,
    paddingVertical: 18,
  },
  selected: {
    borderWidth: 1,
    borderColor: colors.white,
  },
  text: {
    fontSize: fonts.size.small,
    lineHeight: fonts.lineHeight.small,
  },
  radioButtonIcon: {
    marginRight: 12,
  },
});
