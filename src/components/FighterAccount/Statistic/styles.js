import { StyleSheet } from 'react-native';
import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  profileBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    justifyContent: 'space-between',
  },
  profileData: {
    paddingVertical: 8,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.gray,
  },
  profileCenterData: {
    marginHorizontal: 10,
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
