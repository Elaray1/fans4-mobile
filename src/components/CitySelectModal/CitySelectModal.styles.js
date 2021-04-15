import { StyleSheet, Dimensions } from 'react-native';

import colors from 'themes/colors';
// import fonts from 'themes/fonts';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  modal: {
    width,
    justifyContent: 'flex-end',
    backgroundColor: colors.gray,
  },
  background: {
    flex: 1,
    backgroundColor: colors.main,
    opacity: 0.5,
  },
});
