import { StyleSheet, Platform } from 'react-native';
import colors from 'themes/colors';
import fonts from 'themes/fonts';

const isIOS = Platform.OS === 'ios';

export default StyleSheet.create({
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
  fighterBadge: {
    backgroundColor: colors.primaryRed,
    paddingHorizontal: 5,
    paddingVertical: 1,
    position: 'absolute',
    bottom: -8,
    left: 14,
    borderRadius: 5,
  },
  fighterBadgeText: {
    fontFamily: fonts.family.boldItalic,
    ...(isIOS && { fontWeight: fonts.weight.bold }),
    fontSize: fonts.size.caption,
  },
  amateur: {
    backgroundColor: colors.blueBadge,
    left: 22,
  },
});
