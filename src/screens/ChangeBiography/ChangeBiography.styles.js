import { StyleSheet } from 'react-native';
import { commonStyles } from 'themes/commonStyles';

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
  },
  input: {
    height: 120,
  },
  disabledText: {
    opacity: 0.5,
  },
});
