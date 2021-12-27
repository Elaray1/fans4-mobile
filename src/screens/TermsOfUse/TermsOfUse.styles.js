import { StyleSheet } from 'react-native';
import { commonStyles } from 'themes/commonStyles';

import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  loadingView: {
    flex: 1,
    backgroundColor: colors.main,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  screen: {
    ...commonStyles.screen,
  },
  content: {
    ...commonStyles.screenContent,
  },
  scrollView: {
    marginBottom: 10,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  button: {
    position: 'absolute',
    bottom: 0,
  },
  text: {
    fontSize: fonts.size.caption,
    color: colors.grayText,
    paddingBottom: 30,
  },
  title: {
    fontSize: fonts.size.small,
    fontWeight: fonts.weight.bold,
    marginBottom: 20,
  },
});
