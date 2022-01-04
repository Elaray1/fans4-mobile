import { StyleSheet } from 'react-native';

import colors from 'themes/colors';


export default StyleSheet.create({
  wrapper: {
    height: '100%',
    width: '100%',
    backgroundColor: colors.main,
  },
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  loadingView: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.black,
  },
  webView: {
    marginTop: 1,
    backgroundColor: colors.black,
  },
  horizontalModeHeader: {
    position: 'absolute',
    top: 20,
    left: 21,
    flexDirection: 'row',
    alignItems: 'center',
  },
  horizontalModeTitle: {
    marginLeft: 16,
  },
  webViewPressableContainer: {
  },
});
