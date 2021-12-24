import { StyleSheet } from 'react-native';

import { commonStyles } from 'themes/commonStyles';
import colors from 'themes/colors';


export default StyleSheet.create({
  screen: {
    ...commonStyles.screen,
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
});
