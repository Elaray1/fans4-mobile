import { StyleSheet } from 'react-native';
import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  illustration: {
    marginTop: 10,
  },
  title: {
    fontSize: fonts.size.regular,
    fontWeight: fonts.weight.bold,
    marginBottom: 8,
  },
  text: {
    fontSize: fonts.size.small,
    color: colors.grayText,
  },
  textContainer: {
    width: '90%',
    height: 250,
    borderTopWidth: 1,
    borderColor: colors.line,
    marginTop: 28,
    paddingTop: 24,
  },
  pointsContainer: {
    height: '80%',
    marginTop: 16,
  },
  pointContainer: {
    flexDirection: 'row',
    marginVertical: 16,
    height: '50%',
  },
  numberContainer: {
    height: 52,
    width: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray,
    borderRadius: 5,
    marginRight: 16,
  },
  number: {
    fontSize: fonts.size.h2,
    fontWeight: fonts.weight.bold,
  },
});
