import { StyleSheet } from 'react-native';
import colors from 'themes/colors';
import { commonStyles } from 'themes/commonStyles';

export default StyleSheet.create({
  screen: {
    ...commonStyles.screen,
    paddingTop: 30,
  },
  video: {
    width: 400,
    height: 300,
    backgroundColor: colors.defaultBlack,
  },
  button: {
    width: '100%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: colors.primary,
  },
});
