import { StyleSheet } from 'react-native';
import { commonStyles } from 'themes/commonStyles';
import { startScreensStyles } from 'themes/startScreenStyles';

import fonts from 'themes/fonts';

export default StyleSheet.create({
  screen: {
    ...commonStyles.screen,
  },
  content: {
    ...commonStyles.screenContent,
  },
  scrollContent: {
    flex: 1,
  },
  fighterButton: {
    marginBottom: 18,
  },
  title: {
    marginBottom: 76,
    textAlign: 'center',
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
  },
  logo: {
    ...startScreensStyles.logo,
  },
});
