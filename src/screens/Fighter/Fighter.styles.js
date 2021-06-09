import { StyleSheet } from 'react-native';
import { commonStyles } from 'themes/commonStyles';
import colors from 'themes/colors';

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
  postsAndFansBlock: {
    alignItems: 'center',
    marginBottom: 20,
  },
  line: {
    backgroundColor: colors.line,
    height: 1,
  },
  lineIndent: {
    marginBottom: 20,
  },
  space: {
    height: 10,
  },
  loader: {
    paddingVertical: 10,
  },
  applyButton: {
    height: 40,
  },
  loaderWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
});
