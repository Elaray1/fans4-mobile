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

  subscribeButton: {
    height: 40,
  },
  processingIosPurchaseModalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black,
  },
  processingIosPurchaseTitle: {
    marginTop: 40,
    fontSize: fonts.size.regular,
    color: colors.white,
    fontWeight: fonts.weight.bold,
    marginBottom: 20,
  },
  processingIosPurchaseInfoText: {
    fontSize: fonts.size.small,
    color: colors.grayText,
    fontWeight: fonts.weight.medium,
  },
});
