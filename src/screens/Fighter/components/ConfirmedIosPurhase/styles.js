import { StyleSheet } from 'react-native';
import { commonStyles } from 'themes/commonStyles';
import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  descriptionContainer: {
    marginHorizontal: 20,
    marginBottom: 34,
  },
  subscriptionPosibilities: {
    marginTop: 20,
    borderRadius: 10,
    padding: 19,
    display: 'flex',
    marginBottom: 34,
    backgroundColor: colors.gray,
  },
  subscriptionPosibilityContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  subscriptionPosibility: {
    marginLeft: 16,
    fontSize: fonts.size.small,
    color: colors.white,
    fontWeight: fonts.weight.medium,
  },
  subscriptionPosibilityMargin: {
    marginBottom: 13,
  },
  processingIosPurchaseTitle: {
    color: colors.white,
    fontWeight: fonts.weight.bold,
    fontSize: fonts.size.regular,
    marginBottom: 20,
  },
  processingIosPurchaseInfoText: {
    color: colors.grayText,
    fontWeight: fonts.weight.medium,
    fontSize: fonts.size.small,
  },
  titleContainer: {
    alignItems: 'center',
  },
});
