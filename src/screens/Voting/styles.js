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
  emptyView: {
    flex: 1,
    paddingTop: 30,
    alignItems: 'center',
  },
  illustration: {
    width: 250,
    height: 250,
    backgroundColor: colors.gray,
    marginBottom: 50,
  },
  titleText: {
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
  },
  plusText: {
    marginLeft: 3,
  },
  plusButton: {
    paddingVertical: 4,
    paddingLeft: 6,
    paddingRight: 10,
    flexDirection: 'row',
    backgroundColor: colors.gray,
    borderRadius: 5,
  },
});
