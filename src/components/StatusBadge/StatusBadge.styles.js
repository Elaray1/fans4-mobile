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
    paddingVertical: 8,
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
  readyForFightsContainer: {
    backgroundColor: hexToRgba(colors.green, 0.12),
  },
  readyForFightsText: {
    color: colors.green,
  },
  injuredContainer: {
    backgroundColor: hexToRgba(colors.error, 0.12),
  },
  injuredText: {
    color: colors.errorText,
  },
  recoveryContainer: {
    backgroundColor: hexToRgba(colors.yellow, 0.12),
  },
  recoveryText: {
    color: colors.yellow,
  },
  pendingContainer: {
    backgroundColor: colors.primary,
  },
  declinedContainer: {
    backgroundColor: colors.error,
  },
  removedContainer: {
    backgroundColor: colors.error,
  },
});
