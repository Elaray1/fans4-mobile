import { StyleSheet } from 'react-native';

import colors from 'themes/colors';
import fonts from 'themes/fonts';

import { commonStyles } from 'themes/commonStyles';

export default StyleSheet.create({
  screen: {
    ...commonStyles.screen,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    marginTop: 80,
    marginBottom: 20,
    color: colors.primary,
    fontSize: fonts.size.regular,
    fontWeight: fonts.weight.bold,
  },
  subtitle: {
    color: colors.grayText,
    fontSize: fonts.size.small,
    fontWeight: fonts.weight.medium,
  },
  backButton: {
    position: 'absolute',
    bottom: 10,
  },
});
