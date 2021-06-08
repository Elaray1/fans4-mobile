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
  postsAndFansBlock: {
    alignItems: 'center',
    marginBottom: 20,
  },
  line: {
    backgroundColor: colors.line,
    height: 1,
  },
  lineIndent: {
    marginBottom: 20,
  },
  biographyBlock: {
    paddingTop: 18,
  },
  biographyData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  biographyClosedData: {
    paddingBottom: 18,
  },
  blockTitle: {
    fontSize: fonts.size.small,
    lineHeight: fonts.lineHeight.small,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
  },
  biographyText: {
    paddingVertical: 12,
    color: colors.textSecondary,
    fontSize: fonts.size.caption,
    lineHeight: fonts.lineHeight.small,
    fontFamily: fonts.family.base,
    fontWeight: fonts.weight.medium,
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
  space: {
    height: 10,
  },
  loader: {
    paddingVertical: 10,
  },
  applyButton: {
    height: 40,
  },
  loaderWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
});
