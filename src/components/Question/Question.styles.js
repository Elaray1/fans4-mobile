import { StyleSheet } from 'react-native';

import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  container: {
    borderColor: colors.line,
    borderBottomWidth: 1,
    paddingBottom: 18,
    marginBottom: 18,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: fonts.size.small,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
  },
  text: {
    fontSize: fonts.size.caption,
    color: colors.grayText,
    marginTop: 12,
  },
});
