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
  },
  line: {
    backgroundColor: colors.line,
    height: 1,
  },
  lineIndent: {
    marginBottom: 20,
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
  subscribedButton: {
    height: 40,
    marginBottom: 20,
    marginTop: 20,
  },
  noMargin: {
    marginBottom: 0,
  },
  loaderWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  blockTitle: {
    fontSize: fonts.size.small,
    lineHeight: fonts.lineHeight.small,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
  },
  postsTitle: {
    paddingVertical: 18,
  },
  grayText: {
    fontSize: fonts.size.small,
    fontFamily: fonts.family.medium,
    fontWeight: fonts.weight.medium,
    color: colors.grayText,
    marginBottom: 16,
  },
  blockedSupportedFighterText: {
    color: colors.grayText,
    fontWeight: fonts.weight.medium,
    fontSize: fonts.size.caption,
  },
});
