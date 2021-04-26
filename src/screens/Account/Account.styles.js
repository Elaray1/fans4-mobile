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
    marginTop: 20,
  },
  profileBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  photoImage: {
    height: 100,
    width: 100,
    borderRadius: 100,
    marginRight: 24,
  },
  fullName: {
    color: colors.white,
    fontSize: fonts.size.regular,
    lineHeight: fonts.lineHeight.regular,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
  },
  nickname: {
    color: colors.white,
    fontSize: fonts.size.caption,
    lineHeight: fonts.lineHeight.small,
    fontFamily: fonts.family.base,
    fontWeight: fonts.weight.medium,
  },
  location: {
    color: colors.textSecondary,
    fontSize: fonts.size.caption,
    lineHeight: fonts.lineHeight.small,
    fontFamily: fonts.family.base,
    fontWeight: fonts.weight.medium,
    marginBottom: 6,
  },
  line: {
    backgroundColor: colors.line,
    height: 1,
  },
  profileData: {
    paddingVertical: 8,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.gray,
  },
  profileDataTitle: {
    color: colors.textSecondary,
    fontSize: fonts.size.caption,
    lineHeight: fonts.lineHeight.caption,
    fontFamily: fonts.family.base,
    fontWeight: fonts.weight.medium,
    marginBottom: 5,
  },
  profileDataText: {
    fontSize: fonts.size.small,
    lineHeight: fonts.lineHeight.small,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
  },
});
