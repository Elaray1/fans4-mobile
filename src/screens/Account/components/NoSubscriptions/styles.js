import { StyleSheet } from 'react-native';
import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  title: {
    fontSize: fonts.size.small,
    fontWeight: fonts.weight.bold,
    color: colors.white,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: fonts.size.small,
    fontWeight: fonts.weight.medium,
    color: colors.grayText,
    marginBottom: 24,
  },
  chooseFightersContainer: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 20,
    paddingVertical: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray,
    borderRadius: 10,
  },
  chooseFightersText: {
    marginLeft: 12,
    lineHeight: 22,
    fontSize: fonts.size.regular,
    color: colors.white,
    fontWeight: fonts.weight.bold,
  },
});
