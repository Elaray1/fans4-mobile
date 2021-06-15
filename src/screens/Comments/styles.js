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
    marginTop: 45,
    flex: 1,
  },
  emptyView: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 20,
  },
  illustration: {
    width: 250,
    height: 250,
    backgroundColor: colors.gray,
    marginBottom: 50,
  },
  titleText: {
    textAlign: 'center',
    marginBottom: 4,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
  },
  text: {
    textAlign: 'center',
    fontSize: fonts.size.small,
    color: colors.textSecondary,
    fontWeight: fonts.weight.medium,
  },
  line: {
    backgroundColor: colors.line,
    height: 1,
    marginBottom: 12,
  },
  secondaryText: {
    fontSize: fonts.size.caption,
    color: colors.textSecondary,
    fontWeight: fonts.weight.medium,
  },
  commentContainer: {
    paddingBottom: 16,
  },
  input: {
    height: null,
  },
});
