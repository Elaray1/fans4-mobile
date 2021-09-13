import { StyleSheet } from 'react-native';
import { commonStyles } from 'themes/commonStyles';

import fonts from 'themes/fonts';

export default StyleSheet.create({
  screen: {
    ...commonStyles.screen,
  },
  content: {
    ...commonStyles.screenContent,
    justifyContent: 'space-between',
    marginTop: 30,
  },
  text: {
    fontSize: fonts.size.small,
    marginBottom: 8,
  },
  record: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recordInput: {
    width: '30%',
    borderWidth: 1,
  },
});
