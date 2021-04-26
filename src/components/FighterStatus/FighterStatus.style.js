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
  statusText: {
    alignItems: 'baseline',
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
});
