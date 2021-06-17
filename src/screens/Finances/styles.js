import { StyleSheet } from 'react-native';
import { commonStyles } from 'themes/commonStyles';

import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  screen: {
    ...commonStyles.screen,
  },
  content: {
    ...commonStyles.screenContent,
    marginTop: 30,
  },
  scrollView: {
    marginBottom: 10,
  },
  scrollContent: {
    flexGrow: 1,
  },
  addBankAccount: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingVertical: 25,
    backgroundColor: colors.gray,
    borderRadius: 5,
  },
  plus: {
    marginRight: 17,
  },
  title: {
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
  },
  emptyView: {
    marginTop: '35%',
    alignItems: 'center',
  },
  emptyViewImage: {
    width: 126,
    height: 126,
    marginBottom: 50,
    backgroundColor: colors.gray,
  },
  secondaryText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: fonts.size.small,
    color: colors.textSecondary,
  },
});
