import { StyleSheet, Dimensions } from 'react-native';

import colors from 'themes/colors';
import fonts from 'themes/fonts';

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
  datepicker: {
    backgroundColor: colors.gray,
    alignSelf: 'center',
    width: width - 40, // 40 - is the horizontal padding
  },
  doneButton: {
    marginVertical: 10,
    alignSelf: 'flex-end',
    marginHorizontal: 20,
  },
  doneText: {
    color: colors.primary,
    fontSize: fonts.size.small,
    lineHeight: fonts.lineHeight.small,
    fontWeight: fonts.weight.bold,
  },
  line: {
    backgroundColor: colors.line,
    height: 1,
    marginBottom: 10,
  },
});
