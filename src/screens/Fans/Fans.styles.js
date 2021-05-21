import { StyleSheet } from 'react-native';
import { commonStyles, variables } from 'themes/commonStyles';

import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  screen: {
    ...commonStyles.screen,
  },
  loader: {
    paddingVertical: 10,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    // without it scrollbar is not on the end of the screen
    paddingHorizontal: variables.paddingHorizontal,
  },
  listItemCity: {
    color: colors.white,
    fontSize: fonts.size.small,
    lineHeight: fonts.lineHeight.small,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
  },
  line: {
    backgroundColor: colors.line,
    height: 1,
    // without it scrollbar is not on the end of the screen
    marginHorizontal: variables.paddingHorizontal,
  },
});
