import { StyleSheet } from 'react-native';
import { commonStyles } from 'themes/commonStyles';

import hexToRgba from 'helpers/hexToRgba';

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
  addWithdrawalMethod: {
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
  withdrawalMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: colors.gray,
    paddingLeft: 12,
    paddingVertical: 14,
    paddingRight: 15,
  },
  withdrawalMethodNumber: {
    marginTop: 6,
    fontSize: fonts.size.caption,
    color: colors.textSecondary,
  },
  incomeText: {
    marginTop: 10,
    textAlign: 'left',
  },
  incomeContainer: {
    marginTop: 40,
  },
  incomeTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  perPeriod: {
    marginTop: 5,
    fontSize: fonts.size.caption,
  },
  incomeList: {
    marginTop: 32,
  },
  incomeItem: {
    marginBottom: 21,
  },
  incomeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  line: {
    width: '100%',
    height: 1,
    marginTop: 20,
    backgroundColor: colors.line,
  },
  period: {
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.medium,
    fontSize: fonts.size.small,
  },
  totalAmountContainer: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: hexToRgba(colors.green, 0.07),
  },
  totalAmount: {
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
    fontSize: fonts.size.small,
    color: colors.green,
  },
});
