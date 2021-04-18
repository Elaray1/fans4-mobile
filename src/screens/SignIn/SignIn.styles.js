import { StyleSheet } from 'react-native';
import colors from 'themes/colors';
import { commonStyles, variables } from 'themes/commonStyles';

import fonts from 'themes/fonts';

export default StyleSheet.create({
  screen: {
    ...commonStyles.screen,
  },
  content: {
    ...commonStyles.screenContent,
  },
  scrollContent: {
    paddingTop: variables.paddingTopLogo,
    flex: 1,
  },
  logo: {
    marginBottom: 85,
    alignSelf: 'center',
  },
  inputWrapper: {
    marginTop: 50,
  },
  keyboardAvoiding: {
    flex: 1,
    position: 'relative',
    justifyContent: 'space-between',
  },
  signIn: {
    marginTop: 15,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  textLinkWrapper: {
    marginLeft: 3,
  },
  text: {
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
    fontSize: fonts.size.small,
  },
  textLink: {
    textDecorationLine: 'underline',
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 15,
  },
  forgotPassword: {
    marginTop: 5,
    textAlign: 'right',
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.medium,
    fontSize: fonts.size.caption,
    lineHeight: fonts.lineHeight.caption,
  },
  error: {
    marginTop: 25,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    backgroundColor: colors.errorBackground,
  },
  errorText: {
    marginLeft: 8,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.medium,
    color: colors.errorText,
    fontSize: fonts.size.caption,
  },
});
