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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  button: {
    marginTop: 20,
  },
  text: {
    fontSize: fonts.size.caption,
    color: colors.grayText,
    paddingBottom: 30,
  },
  title: {
    fontSize: fonts.size.small,
    fontWeight: fonts.weight.bold,
    marginBottom: 20,
  },
});
