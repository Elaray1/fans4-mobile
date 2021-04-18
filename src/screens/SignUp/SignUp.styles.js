import { StyleSheet } from 'react-native';
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
    marginTop: 20,
  },
});
