import { StyleSheet } from 'react-native';
import colors from 'themes/colors';
import { commonStyles, variables } from 'themes/commonStyles';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  screen: {
    ...commonStyles.screen,
  },
  content: {
    ...commonStyles.screenContent,
    justifyContent: 'space-between',
    paddingBottom: 70,
    paddingTop: 30,
  },
  qrContainer: {
    height: 365,
    backgroundColor: colors.grayBlock,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderRadius: 20,
  },
  title: {
    textAlign: 'center',
    fontSize: fonts.size.small,
    lineHeight: fonts.lineHeight.small,
  },
  description: {
    color: colors.grayText,
    textAlign: 'center',
    fontSize: fonts.size.small,
    lineHeight: fonts.lineHeight.small,
    marginTop: 8,
  },
  name: {
    textAlign: 'center',
    fontSize: fonts.size.regular,
    lineHeight: fonts.lineHeight.regular,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
  },
});
