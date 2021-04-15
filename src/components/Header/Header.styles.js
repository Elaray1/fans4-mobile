import { StyleSheet } from 'react-native';

import colors from 'themes/colors';
import fonts from 'themes/fonts';
import { variables } from 'themes/commonStyles';

export default StyleSheet.create({
  headerWrapper: {
    flexDirection: 'column',
    paddingHorizontal: variables.paddingHorizontal,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: fonts.size.regular,
    fontWeight: fonts.weight.bold,
    lineHeight: fonts.lineHeight.regular,
  },
  backButtonWrapper: {
    backgroundColor: colors.gray,
    width: 32,
    height: 32,
    borderRadius: 5,
  },
  backButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    backgroundColor: colors.line,
    height: 1,
    marginBottom: 30,
  },
});
