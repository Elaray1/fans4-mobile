import { StyleSheet } from 'react-native';
import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  descriptionContainer: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 34,
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
    marginTop: 20,
    marginBottom: 20,
  },
  doneButton: {
    marginTop: 34,
  },
  linearGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '120%',
    height: '40%',
  },
});
