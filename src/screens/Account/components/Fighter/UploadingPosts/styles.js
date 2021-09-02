import { StyleSheet } from 'react-native';
import colors from 'themes/colors';
import fonts from 'themes/fonts';
import hexToRgba from 'helpers/hexToRgba';

export default StyleSheet.create({
  loadingPostContainer: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: colors.gray,
    borderRadius: 5,
  },
  loadingPostText: {
    color: colors.textSecondary,
    fontSize: fonts.size.caption,
    fontFamily: fonts.family.medium,
    fontWeight: fonts.weight.medium,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: hexToRgba(colors.primary, 0.15),
    borderRadius: 4,
    marginTop: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  loadingErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tryAgain: {
    marginRight: 8.5,
  },
  uploadFailedText: {
    marginTop: 5,
  },
  tryAgainText: {
    color: colors.link,
    fontSize: fonts.size.small,
    fontWeight: fonts.weight.bold,
    fontFamily: fonts.family.bold,
  },
});
