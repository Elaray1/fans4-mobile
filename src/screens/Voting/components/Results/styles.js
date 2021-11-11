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
    marginVertical: 50,
  },
  titleText: {
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
  },
  descriptionText: {
    color: colors.grayText,
    fontSize: fonts.size.small,
    textAlign: 'center',
  },
  plusButton: {
    marginTop: 20,
    borderRadius: 5,
    backgroundColor: colors.primary,
    width: '100%',
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: colors.primaryButtonText,
    fontWeight: fonts.weight.bold,
    marginLeft: 4,
  },
});
