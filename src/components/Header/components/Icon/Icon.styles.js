import { StyleSheet } from 'react-native';

import colors from 'themes/colors';

export default StyleSheet.create({
  iconButtonWrapper: {
    backgroundColor: colors.gray,
    width: 32,
    height: 32,
    borderRadius: 5,
  },
  iconButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
