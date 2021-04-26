import { StyleSheet } from 'react-native';
import { commonStyles } from 'themes/commonStyles';

import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  screen: {
    ...commonStyles.screen,
  },
  content: {
    ...commonStyles.screenContent,
    marginTop: 30,
  },
  scrollContent: {
    flexGrow: 1,
  },
  item: {
    paddingVertical: 18,
  },
  line: {
    backgroundColor: colors.line,
    height: 1,
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontSize: fonts.size.small,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
  },
});
