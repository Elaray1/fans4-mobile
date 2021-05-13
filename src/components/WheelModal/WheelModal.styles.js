import { StyleSheet, Dimensions } from 'react-native';

import colors from 'themes/colors';
import fonts from 'themes/fonts';
import { variables } from 'themes/commonStyles';

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
  picker: {
    backgroundColor: colors.gray,
    alignSelf: 'center',
    width: width - variables.paddingHorizontal * 2,
  },
  doneButton: {
    paddingVertical: 10,
    alignSelf: 'flex-end',
    paddingHorizontal: variables.paddingHorizontal,
  },
  doneText: {
    fontFamily: fonts.family.bold,
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
  itemStyle: {
    color: colors.white,
  },
});
