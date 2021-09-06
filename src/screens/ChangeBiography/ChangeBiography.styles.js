import { StyleSheet } from 'react-native';
import { commonStyles } from 'themes/commonStyles';
import colors from 'themes/colors';

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
});
