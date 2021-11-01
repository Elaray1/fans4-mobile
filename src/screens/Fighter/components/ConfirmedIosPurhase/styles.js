import { StyleSheet, Dimensions } from 'react-native';
import colors from 'themes/colors';
import fonts from 'themes/fonts';

import { variables } from 'themes/commonStyles';

const { width } = Dimensions.get('window');

const buttonWidth = width - variables.paddingHorizontal * 2;

export default StyleSheet.create({
  container: {
    flex: 1,
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
    width: buttonWidth,
  },
  linearGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '120%',
    height: '40%',
  },
});
