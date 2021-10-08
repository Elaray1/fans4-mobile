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
    marginBottom: 19,
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
    fontWeight: fonts.weight.bold,
    color: colors.white,
  },
  emptyView: {
    marginBottom: 0,
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
  iosPaymentFailedContainer: {
    backgroundColor: colors.errorBackground2,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  iosPaymentFailedText: {
    color: colors.error,
    fontSize: fonts.size.tiny,
    fontWeight: fonts.weight.bold,
  },
});
