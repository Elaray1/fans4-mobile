import { StyleSheet } from 'react-native';
import { commonStyles } from 'themes/commonStyles';
import colors from 'themes/colors';
import fonts from 'themes/fonts';
import hexToRgba from 'helpers/hexToRgba';

export default StyleSheet.create({
  screen: {
    ...commonStyles.screen,
  },
  content: {
    ...commonStyles.screenContent,
    marginTop: 30,
  },
  scrollContent: {
    flexGrow: 1,
  },
  input: {
    height: 120,
  },
  disabledText: {
    opacity: 0.5,
  },
  uploadButton: {
    marginBottom: 20,
  },
  videoContainer: {
    marginBottom: 20,
  },
  bin: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  loaderOverlay: {
    backgroundColor: colors.black,
    opacity: 0.8,
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    zIndex: 100,
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  grayText: {
    color: colors.grayText,
    fontSize: fonts.size.small,
  },
  textContainer: {
    marginTop: 30,
  },
  uploadingContainer: {
    backgroundColor: colors.gray,
    borderRadius: 5,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  loadingPostText: {
    color: colors.primary,
    fontSize: fonts.size.small,
    fontFamily: fonts.family.medium,
    fontWeight: fonts.weight.medium,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: hexToRgba(colors.primary, 0.15),
    borderRadius: 5,
    marginTop: 12,
  },
  progressBar: {
    height: 10,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  crossIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  processingIntroVideoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 190,
    width: '100%',
    backgroundColor: colors.processingBackground,
    borderRadius: 5,
    marginBottom: 20,
  },
  processingText: {
    color: colors.white,
    fontSize: fonts.size.caption,
    fontWeight: fonts.weight.medium,
    marginTop: 5,
    marginBottom: 12,
  },
  keyboardAvoiding: {
    flex: 1,
  },
});
