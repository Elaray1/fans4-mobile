import { StyleSheet } from 'react-native';
import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  noFightsTitle: {
    marginBottom: 20,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
  },
  button: {
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
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
    marginLeft: 4,
  },
  noFightsText: {
    marginBottom: 20,
    textAlign: 'center',
    color: colors.grayText,
    fontSize: fonts.size.small,
    fontFamily: fonts.family.base,
    fontWeight: fonts.weight.medium,
  },
  noFightsContainer: {
    marginTop: 41,
    alignItems: 'center',
  },
});
