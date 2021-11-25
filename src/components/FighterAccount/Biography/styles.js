import { StyleSheet } from 'react-native';
import colors from 'themes/colors';
import fonts from 'themes/fonts';
import hexToRgba from 'helpers/hexToRgba';

export default StyleSheet.create({
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText: {
    color: colors.link,
    fontSize: fonts.size.small,
    lineHeight: fonts.lineHeight.small,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
  },
  addBiographyAndVideo: {
    paddingTop: 36,
    paddingBottom: 49,
  },
  addVideo: {
    paddingVertical: 32,
  },
  addIcon: {
    marginRight: 8,
  },
  addBiographyText: {
    marginVertical: 24,
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
  uploadingContainer: {
    marginTop: 10,
  },
  introVideo: {
    marginTop: 14,
  },
  processingIntroVideoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 185,
    width: '100%',
    backgroundColor: '#54565E',
    borderRadius: 5,
  },
  processingText: {
    color: colors.white,
    fontSize: fonts.size.caption,
    fontWeight: fonts.weight.medium,
    marginTop: 5,
    marginBottom: 12,
  },
});
