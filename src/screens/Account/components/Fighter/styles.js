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
  },
  flatListHeader: {
    marginTop: 20,
  },
  line: {
    backgroundColor: colors.line,
    height: 1,
  },
  lineIndent: {
    marginBottom: 20,
  },
  postsTitle: {
    paddingVertical: 18,
  },
  space: {
    height: 10,
  },
  loader: {
    paddingVertical: 10,
  },
  noItemsContainer: {
    alignItems: 'center',
    paddingTop: 32,
    marginBottom: 80,
  },
  noItemsText: {
    color: colors.grayText,
    fontWeight: fonts.weight.medium,
    fontSize: fonts.size.small,
  },
  noItemsButtonText: {
    marginTop: 10,
    color: colors.link,
    fontSize: fonts.size.small,
    fontWeight: fonts.weight.bold,
    fontFamily: fonts.family.bold,
  },
});
