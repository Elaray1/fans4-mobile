import { StyleSheet } from 'react-native';
import { commonStyles } from 'themes/commonStyles';

export default StyleSheet.create({
  screen: {
    ...commonStyles.screen,
  },
  content: {
    ...commonStyles.screenContent,
    marginTop: 30,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  selectList: {
    height: '68%',
    justifyContent: 'space-between',
  },
});
