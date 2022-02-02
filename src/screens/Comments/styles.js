import { Platform, StyleSheet } from 'react-native';
import { commonStyles } from 'themes/commonStyles';
import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  screen: {
    ...commonStyles.screen,
  },
  content: {
    marginTop: 30,
    flex: 1,
  },
  postContainer: {
    marginBottom: 30,
    marginHorizontal: 20,
  },
  emptyView: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 20,
  },
  illustration: {
    width: 250,
    height: 250,
    marginVertical: 20,
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
    marginHorizontal: 20,
  },
  input: {
    height: null,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  keyboardAvoidingChildContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  multiline: {
    textAlignVertical: Platform.OS === 'ios' ? 'top' : 'bottom',
  },
});
