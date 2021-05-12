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
  textInput: {
    height: 120,
    marginBottom: 40,
  },
  disabledSubmitText: {
    opacity: 0.5,
  },
  contentContainer: {
    flex: 1,
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
