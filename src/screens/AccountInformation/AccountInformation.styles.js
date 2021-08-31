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
  email: {
    fontSize: fonts.size.caption,
    color: colors.textSecondary,
    lineHeight: fonts.lineHeight.small,
  },
  arrowRight: {
    marginLeft: 18,
  },
  arrowSpace: {
    width: 26,
  },
  emailPending: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    backgroundColor: colors.backgroundLink,
  },
  emailPendingText: {
    color: colors.link,
    fontSize: fonts.size.caption,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
    lineHeight: fonts.lineHeight.caption,
  },
  newEmail: {
    marginRight: 12,
  },
});
