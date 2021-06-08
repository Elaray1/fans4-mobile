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
  },
  flatListHeader: {
    marginTop: 20,
  },
  line: {
    backgroundColor: colors.line,
    height: 1,
  },
  lineIndent: {
    marginBottom: 20,
  },
  personalInfoContainer: {
    marginTop: 12,
  },
  personalInfoData: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  personalInfoTitle: {
    color: colors.textSecondary,
    fontSize: fonts.size.caption,
    lineHeight: fonts.lineHeight.caption,
    fontFamily: fonts.family.base,
    fontWeight: fonts.weight.medium,
  },
  personalInfoValue: {
    fontSize: fonts.size.caption,
    lineHeight: fonts.lineHeight.caption,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
  },
  postsTitle: {
    paddingVertical: 18,
  },
  space: {
    height: 10,
  },
  loader: {
    paddingVertical: 10,
  },
  noItemsContainer: {
    alignItems: 'center',
    paddingTop: 32,
  },
  noItemsText: {
    color: colors.grayText,
    fontWeight: fonts.weight.medium,
    fontSize: fonts.size.small,
  },
  noItemsButtonText: {
    marginTop: 10,
    color: colors.primary,
    fontSize: fonts.size.small,
    fontWeight: fonts.weight.bold,
    fontFamily: fonts.family.bold,
  },
});
