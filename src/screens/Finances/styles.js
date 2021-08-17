import { StyleSheet, Dimensions } from 'react-native';
import { commonStyles } from 'themes/commonStyles';

import hexToRgba from 'helpers/hexToRgba';

import colors from 'themes/colors';
import fonts from 'themes/fonts';

const { height } = Dimensions.get('window');

const VERY_SMALL_SCREEN_HEIGHT = 568;

const emptyViewImage = {
  width: 200,
  height: 200,
  marginBottom: 50,
};

const emptyView = {
  marginTop: '35%',
  alignItems: 'center',
};

if (height <= VERY_SMALL_SCREEN_HEIGHT) {
  emptyViewImage.marginBottom = 0;
  emptyView.marginTop = '25%';
}

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
  withdrawalMethodStatus: {
    marginRight: 9,
    marginTop: -1,
  },
  updateContainer: {
    marginBottom: 20,
    backgroundColor: colors.gray,
    padding: 16,
    borderRadius: 5,
  },
  updateButton: {
    backgroundColor: colors.primary,
    width: '100%',
  },
  updateTitle: {
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
  },
  updateText: {
    marginTop: 8,
    marginBottom: 17,
    color: colors.textSecondary,
    fontSize: fonts.size.small,
  },
  bankAccountTitle: {
    flexDirection: 'row',
  },
  emptyViewImage,
  emptyView,
});
