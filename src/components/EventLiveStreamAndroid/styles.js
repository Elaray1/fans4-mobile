import { StyleSheet } from 'react-native';

import colors from 'themes/colors';


export default StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'absolute',
    zIndex: 10000,
  },
  webViewContainer: {
    flex: 1,
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
    flex: 1,
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
    flex: 1,
  },
});
