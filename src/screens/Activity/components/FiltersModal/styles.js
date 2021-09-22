import { StyleSheet, Dimensions } from 'react-native';

import colors from 'themes/colors';
import fonts from 'themes/fonts';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.main,
    opacity: 0.5,
  },
  modal: {
    width,
    paddingHorizontal: 20,
    paddingVertical: 28,
    marginTop: 125,
    backgroundColor: colors.gray,
  },
  title: {
    fontSize: fonts.size.small,
  },
  line: {
    backgroundColor: colors.line,
    height: 1,
    marginVertical: 12,
  },
  filter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
