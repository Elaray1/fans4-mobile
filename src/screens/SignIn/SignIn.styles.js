import { StyleSheet } from 'react-native';
import colors from 'themes/colors';
import { commonStyles } from 'themes/commonStyles';
import { startScreensStyles } from 'themes/startScreenStyles';

import fonts from 'themes/fonts';

const ICON_SIZE = 32;
const TITLE_CONTAINER_HEIGHT = 20;

export default StyleSheet.create({
  screen: {
    ...commonStyles.screen,
  },
  content: {
    ...commonStyles.screenContent,
  },
  scrollContent: {
    flex: 1,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  keyboardAvoidingChildContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  logo: {
    ...startScreensStyles.logo,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: TITLE_CONTAINER_HEIGHT,
  },
  backButtonWrapper: {
    backgroundColor: colors.gray,
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: 5,
    // this rules center icon vertically without increasing container height
    position: 'absolute',
    left: 0,
    top: 0,
    transform: [{ translateY: -((ICON_SIZE - TITLE_CONTAINER_HEIGHT) / 2) }],
  },
  backButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInButtonWrapper: {
    width: '100%',
  },
  signUpTextWrapper: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 15,
  },
  signUpTextLinkWrapper: {
    marginLeft: 3,
  },
  signUpText: {
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
    fontSize: fonts.size.small,
  },
  emailInput: {
    marginBottom: 23,
  },
  button: {
    marginTop: 10,
  },
  error: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    backgroundColor: colors.errorBackground,
    borderRadius: 5,
  },
  errorText: {
    marginLeft: 8,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.medium,
    color: colors.errorText,
    fontSize: fonts.size.caption,
  },
  title: {
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
  },
  errorContainer: {
    marginTop: 10,
    width: '100%',
    height: 60,
    justifyContent: 'center',
  },
  forgotPassword: {
    marginTop: 16,
    textAlign: 'right',
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.medium,
    fontSize: fonts.size.caption,
    lineHeight: fonts.lineHeight.caption,
  },
});
