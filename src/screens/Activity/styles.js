import { StyleSheet } from 'react-native';
import { commonStyles } from 'themes/commonStyles';
import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  screen: {
    ...commonStyles.screen,
  },
  content: {
    ...commonStyles.screenContent,
    marginTop: 30,
  },
  activity: {
    marginBottom: 10,
  },
  noActivities: {
    flex: 1,
    alignItems: 'center',
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
  headerIcon: {
    marginLeft: 15,
    marginTop: 5,
  },
});
