import { StyleSheet } from 'react-native';

import colors from 'themes/colors';
import { variables } from 'themes/commonStyles';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  headerWrapper: {
    paddingHorizontal: variables.paddingHorizontal,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 32,
    marginTop: 25,
  },
  title: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.regular,
    fontWeight: fonts.weight.bold,
    lineHeight: fonts.lineHeight.regular,
  },
  line: {
    backgroundColor: colors.line,
    height: 1,
  },
  text: {
    fontSize: fonts.size.small,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
    lineHeight: fonts.lineHeight.small,
    color: colors.primary,
  },
  plusText: {
    marginLeft: 3,
  },
  plusButton: {
    paddingVertical: 4,
    paddingLeft: 6,
    paddingRight: 10,
    flexDirection: 'row',
    backgroundColor: colors.gray,
    borderRadius: 5,
    marginLeft: -80,
  },
});
