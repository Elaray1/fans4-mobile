import { StyleSheet } from 'react-native';
import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  subscriptionPosibilities: {
    borderRadius: 10,
    padding: 19,
    display: 'flex',
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
});
