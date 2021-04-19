import { StyleSheet } from 'react-native';
import { commonStyles, variables } from 'themes/commonStyles';

export default StyleSheet.create({
  screen: {
    ...commonStyles.screen,
  },
  content: {
    paddingTop: variables.paddingTop,
    ...commonStyles.screenContent,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: 50,
  },
});
