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
  createdFightContainer: {
    backgroundColor: colors.buttonNotification,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  createdFightText: {
    lineHeight: 20,
    color: colors.primary,
    fontWeight: fonts.weight.medium,
    fontSize: fonts.size.caption,
  },
  cannotApplyForAFightText: {
    color: colors.grayText,
    fontWeight: fonts.weight.medium,
    fontSize: fonts.size.caption,
  },
  createdFightTextWrapper: {
    flexDirection: 'row',
  },
});
