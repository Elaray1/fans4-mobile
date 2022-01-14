import { StyleSheet } from 'react-native';

import colors from 'themes/colors';

export default StyleSheet.create({
  wrapper: {
    height: '100%',
    width: '100%',
    backgroundColor: colors.main,
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.black,
  },
});
