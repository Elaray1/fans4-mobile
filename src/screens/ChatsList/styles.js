import { StyleSheet } from 'react-native';
import { commonStyles } from 'themes/commonStyles';
import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  screen: {
    ...commonStyles.screen,
  },
  content: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  flatList: {
    height: '92%',
  },
  emptyView: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustration: {
    width: 250,
    height: 250,
    marginVertical: 50,
  },
  titleText: {
    marginBottom: 20,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
  },
  text: {
    textAlign: 'center',
    fontSize: fonts.size.small,
    color: colors.textSecondary,
    fontWeight: fonts.weight.medium,
  },
  emptyScroll: {
    flexGrow: 1,
  },
  loader: {
    margin: 15,
  },
});
