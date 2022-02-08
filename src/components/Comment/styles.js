import { StyleSheet } from 'react-native';
import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  repliesContainer: {
    marginLeft: 20,
  },
  secondaryText: {
    fontSize: fonts.size.caption,
    color: colors.textSecondary,
    fontWeight: fonts.weight.medium,
  },
  seeMoreButton: {
    borderColor: colors.line,
    borderBottomWidth: 1,
    paddingVertical: 16,
    paddingLeft: 20,
  },
});
