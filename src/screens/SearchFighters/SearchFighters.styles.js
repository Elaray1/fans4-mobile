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
  fighterImage: {
    height: 54,
    width: 54,
    borderRadius: 100,
    marginRight: 16,
  },
  fightersList: {
    marginTop: 27,
  },
  fighter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    backgroundColor: colors.line,
    height: 1,
    marginVertical: 10,
  },
  fullName: {
    fontSize: fonts.size.small,
    lineHeight: fonts.lineHeight.small,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
  },
  nickname: {
    fontSize: fonts.size.caption,
    lineHeight: fonts.lineHeight.small,
  },
  city: {
    color: colors.grayText,
    fontSize: fonts.size.caption,
    lineHeight: fonts.lineHeight.caption,
  },
  loader: {
    paddingVertical: 10,
  },
});
