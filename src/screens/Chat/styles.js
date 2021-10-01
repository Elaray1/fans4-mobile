import { Platform, StyleSheet, Dimensions } from 'react-native';
import { commonStyles } from 'themes/commonStyles';
import colors from 'themes/colors';
import fonts from 'themes/fonts';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  screen: {
    ...commonStyles.screen,
  },
  content: {
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
    marginVertical: 50,
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
    width,
    marginBottom: 12,
  },
  messageContainer: {
    paddingBottom: 28,
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
  horizontalPaddings: {
    paddingHorizontal: 20,
  },
  dateSeparator: {
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 16,
    fontSize: fonts.size.small,
    fontWeight: fonts.weight.medium,
    color: colors.textSecondary,
  },
  scrollView: {
    flexGrow: 1,
  },
});
