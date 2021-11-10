import { StyleSheet } from 'react-native';
import { commonStyles } from 'themes/commonStyles';
import colors from 'themes/colors';
import fonts from 'themes/fonts';

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
    fontFamily: fonts.family.base,
    fontWeight: fonts.weight.medium,
  },
  mediaContainer: {
    marginTop: 44,
  },
  postImage: {
    width: '100%',
    resizeMode: 'contain',
    borderRadius: 5,
  },
  mediaText: {
    color: colors.grayText,
    fontSize: fonts.size.caption,
    fontFamily: fonts.family.base,
    fontWeight: fonts.weight.medium,
    marginBottom: 6,
  },
});
