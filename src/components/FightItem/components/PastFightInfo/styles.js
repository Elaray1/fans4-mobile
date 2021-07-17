import { StyleSheet } from 'react-native';
import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  pastContainer: {
    width: '100%',
  },
  dateContainer: {
    paddingBottom: 12,
    width: '100%',
    borderBottomWidth: 1,
    borderColor: colors.line,
  },
  text: {
    textAlign: 'center',
    fontSize: fonts.size.caption,
    color: colors.textSecondary,
    fontWeight: fonts.weight.medium,
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
    fontSize: fonts.size.caption,
  },
  location: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
