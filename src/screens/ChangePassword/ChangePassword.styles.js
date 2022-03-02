import { StyleSheet } from 'react-native';
import colors from 'themes/colors';
import { commonStyles, variables } from 'themes/commonStyles';
import fonts from 'themes/fonts';

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
  },
  formContainer: {
    justifyContent: 'space-between',
    flex: 1,
  },
  buttonContainer: {
    alignItems: 'center',
    height: 100,
    justifyContent: 'space-evenly',
  },
  text: {
    color: colors.grayText,
    fontSize: fonts.size.small,
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
