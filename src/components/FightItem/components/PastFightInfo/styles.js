import { StyleSheet } from 'react-native';
import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  pastContainer: {
    width: '100%',
  },
  fightInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    width: '100%',
    borderBottomWidth: 1,
    borderColor: colors.line,
  },
  text: {
    textAlign: 'center',
    fontSize: fonts.size.caption,
    color: colors.textSecondary,
    fontFamily: fonts.family.base,
    fontWeight: fonts.weight.medium,
  },
  recordText: {
    color: colors.primary,
  },
  resultContainer: {
    paddingTop: 12,
    width: '100%',
  },
  textContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  resultsText: {
    color: colors.white,
    fontSize: fonts.size.caption,
    fontFamily: fonts.family.base,
    fontWeight: fonts.weight.medium,
  },
  location: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
