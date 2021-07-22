import { StyleSheet } from 'react-native';

import colors from 'themes/colors';
import fonts from 'themes/fonts';

import { commonStyles } from 'themes/commonStyles';

export default StyleSheet.create({
  screen: {
    ...commonStyles.screen,
  },
  content: {
    ...commonStyles.screenContent,
    marginTop: 30,
    paddingBottom: 34,
  },
  selectList: {
    justifyContent: 'space-between',
  },
  radioButton: {
    marginVertical: null,
    marginBottom: 16,
  },
  text: {
    marginBottom: 24,
    color: colors.textSecondary,
    fontSize: fonts.size.small,
    fontWeight: fonts.weight.medium,
  },
  input: {
    height: 120,
    marginBottom: 40,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  keyboardAvoidingChildContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
});
