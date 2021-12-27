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
  typingMessage: {
    marginTop: 8,
    marginBottom: 4,
    fontSize: fonts.size.small,
    color: colors.textSecondary,
    fontWeight: fonts.weight.medium,
  },
  newMessagesText: {
    color: colors.gray,
    fontSize: fonts.size.caption,
    fontWeight: fonts.weight.medium,
  },
  newMessage: {
    width: 120,
    backgroundColor: colors.primary,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 5,
    zIndex: 1,
    elevation: 1,
  },
  newMessagesLine: {
    position: 'absolute',
    top: 16,
    height: 1,
    width: '100%',
    backgroundColor: colors.line,
  },
  newMessageContainer: {
    marginVertical: 16,
  },
  closingReasonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 26,
    paddingVertical: 16,
    backgroundColor: colors.gray,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.error,
  },
  closingReasonText: {
    maxWidth: '90%',
    fontSize: fonts.size.small,
  },
  errorIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  loader: {
    margin: 15,
  },
});
