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
  textInput: {
    height: 120,
    marginBottom: 40,
  },
  disabledSubmitText: {
    opacity: 0.5,
  },
});
