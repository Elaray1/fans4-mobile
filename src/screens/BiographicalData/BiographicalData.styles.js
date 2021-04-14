import { StyleSheet } from 'react-native';
import commonStyles from 'themes/commonStyles';

import colors from 'themes/colors';

export default StyleSheet.create({
  screen: {
    ...commonStyles.screen,
  },
  content: {
    ...commonStyles.screenContent,
  },
  datepicker: {
    backgroundColor: colors.main,
    alignSelf: 'center',
  },
});
