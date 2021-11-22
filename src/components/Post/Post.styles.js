import { StyleSheet } from 'react-native';

import hexToRgba from 'helpers/hexToRgba';

import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  processingText: {
    color: colors.grayText,
    fontSize: fonts.size.caption,
    fontWeight: fonts.weight.medium,
    marginBottom: 12,
  },
  processingMediaContainer: {
    width: '100%',
    height: 185,
    backgroundColor: '#54565E',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  processingPostWithText: {
    paddingBottom: 0,
  },
  post: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: colors.gray,
    borderRadius: 5,
  },
  author: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 100,
  },
  authorFullName: {
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
    fontSize: fonts.size.small,
    lineHeight: fonts.lineHeight.small,
    marginLeft: 10,
  },
  postImage: {
    width: '100%',
    resizeMode: 'contain',
    borderRadius: 5,
  },
  description: {
    color: colors.white,
    fontFamily: fonts.family.base,
    fontWeight: fonts.weight.medium,
    fontSize: fonts.size.small,
    lineHeight: fonts.lineHeight.small,
    marginBottom: 12,
  },
  blockedPost: {
    height: 163,
    backgroundColor: hexToRgba(colors.grayText, 0.2),
    borderRadius: 5,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  approvedStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    color: colors.textSecondary,
    fontFamily: fonts.family.base,
    fontWeight: fonts.weight.medium,
    fontSize: fonts.size.tiny,
    lineHeight: fonts.lineHeight.small,
  },
  likedBy: {
    color: colors.textSecondary,
    fontFamily: fonts.family.base,
    fontWeight: fonts.weight.medium,
    fontSize: fonts.size.caption,
    lineHeight: fonts.lineHeight.small,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
  },
  postAction: {
    backgroundColor: hexToRgba(colors.white, 0.05),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  postActionRight: {
    marginLeft: 6,
  },
  postActionText: {
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
    fontSize: fonts.size.caption,
    lineHeight: fonts.lineHeight.caption,
    marginLeft: 6,
  },
  mediaContainer: {
    marginBottom: 12,
  },
  disabled: {
    color: colors.whiteDisabled,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  textContainer: {
    marginTop: 12,
    flexDirection: 'row',
  },
  editedLabel: {
    marginLeft: 4,
    color: colors.grayText,
    fontSize: fonts.size.caption,
  },
});
