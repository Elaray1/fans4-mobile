import { StyleSheet } from 'react-native';
import { commonStyles } from 'themes/commonStyles';

import fonts from 'themes/fonts';

export default StyleSheet.create({
  screen: {
    ...commonStyles.screen,
  },
  content: {
    ...commonStyles.screenContent,
    marginTop: 30,
  },
  text: {
    fontSize: fonts.size.small,
    marginBottom: 10,
  },
});
