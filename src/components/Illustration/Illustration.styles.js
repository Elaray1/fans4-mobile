import { StyleSheet } from 'react-native';
import colors from 'themes/colors';
import { commonStyles } from 'themes/commonStyles';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  screen: {
    ...commonStyles.screen,
  },
  content: {
    ...commonStyles.screenContent,
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 20,
  },
  imagePlaceholder: {
    height: 250,
    width: 250,
    backgroundColor: colors.gray,
    marginVertical: 50,
  },
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: fonts.size.regular,
    fontWeight: fonts.weight.bold,
    fontFamily: fonts.family.bold,
    marginBottom: 20,
  },
  text: {
    fontSize: fonts.size.small,
    textAlign: 'center',
    color: colors.grayText,
  },
  textContainer: {
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
    height: 100,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});
