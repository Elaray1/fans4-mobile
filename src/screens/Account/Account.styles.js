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
  lineIndent: {
    marginBottom: 20,
  },
  profileData: {
    paddingVertical: 8,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.gray,
  },
  profileLeftData: {
    marginRight: 10,
  },
  profileRightData: {
    marginLeft: 10,
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
  addBiographyContainter: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 36,
    paddingBottom: 49,
  },
  addBiographyText: {
    color: colors.primary,
    fontSize: fonts.size.small,
    lineHeight: fonts.lineHeight.small,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
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
});
