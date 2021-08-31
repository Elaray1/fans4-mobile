import { StyleSheet } from 'react-native';
import { commonStyles } from 'themes/commonStyles';
import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  content: {
    ...commonStyles.screenContent,
  },
  account: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    paddingBottom: 24,
    paddingTop: 30,
  },
  name: {
    fontSize: fonts.size.medium,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
    color: colors.white,
    marginRight: 8,
  },
  grayText: {
    fontSize: fonts.size.small,
    fontFamily: fonts.family.medium,
    fontWeight: fonts.weight.medium,
    color: colors.grayText,
  },
  caption: {
    fontSize: fonts.size.caption,
    fontFamily: fonts.family.medium,
    fontWeight: fonts.weight.medium,
    color: colors.grayText,
  },
  title: {
    fontSize: fonts.size.small,
    fontFamily: fonts.family.medium,
    fontWeight: fonts.weight.medium,
    color: colors.white,
    marginVertical: 19,
  },
  emptyView: {
    marginBottom: 0,
  },
  subscriptions: {
    paddingBottom: 20,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  fighterImage: {
    height: 54,
    width: 54,
    borderRadius: 100,
    marginRight: 16,
  },
  fighter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
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
  bottomText: {
    marginTop: 20,
  },
  expirationDate: {
    color: colors.grayText,
    fontSize: fonts.size.caption,
    lineHeight: fonts.lineHeight.caption,
  },
  loader: {
    marginTop: 20,
    marginBottom: 20,
  },
  textContainer: {
    marginBottom: 20,
  },
});
