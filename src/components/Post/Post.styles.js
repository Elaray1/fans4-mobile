import { StyleSheet } from 'react-native';

import hexToRgba from 'helpers/hexToRgba';

import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  post: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: colors.gray,
    borderRadius: 5,
  },
  author: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
    color: colors.textSecondary,
    fontFamily: fonts.family.base,
    fontWeight: fonts.weight.medium,
    fontSize: fonts.size.caption,
    lineHeight: fonts.lineHeight.small,
    marginBottom: 12,
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
});
