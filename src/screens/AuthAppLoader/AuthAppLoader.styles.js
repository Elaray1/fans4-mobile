import { StyleSheet } from 'react-native';
import colors from 'themes/colors';
import { commonStyles } from 'themes/commonStyles';

export default StyleSheet.create({
  screen: {
    ...commonStyles.screen,
  },
  content: {
    ...commonStyles.screenContent,
  },
  button: {
    backgroundColor: colors.disabled,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    marginVertical: 4,
  },
});
