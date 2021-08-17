import { StyleSheet } from 'react-native';

import colors from 'themes/colors';
import fonts from 'themes/fonts';

import hexToRgba from 'helpers/hexToRgba';

export default StyleSheet.create({
  statusWrapper: {
    alignItems: 'baseline',
  },
  statusContainer: {
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  statusPostContainer: {
    paddingVertical: 6,
  },
  statusText: {
    textAlign: 'center',
    fontSize: fonts.size.caption,
    lineHeight: fonts.lineHeight.caption,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
  },
  activeContainer: {
    backgroundColor: hexToRgba(colors.green, 0.12),
  },
  activeText: {
    color: colors.green,
  },
  pendingContainer: {
    backgroundColor: hexToRgba(colors.primary, 0.12),
  },
  pendingText: {
    color: colors.primary,
  },
  restrictedContainer: {
    backgroundColor: colors.errorContainer,
  },
  restrictedText: {
    color: colors.error,
  },
});
