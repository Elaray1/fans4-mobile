import { StyleSheet } from 'react-native';

import colors from 'themes/colors';
import { variables } from 'themes/commonStyles';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  headerWrapper: {
    paddingHorizontal: variables.paddingHorizontal,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 32,
    marginTop: 25,
  },
  title: {
    fontFamily: fonts.family.bold,
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
