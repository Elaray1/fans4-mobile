import { StyleSheet } from 'react-native';
import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  container: {
    backgroundColor: colors.black,
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginTop: 169,
    marginBottom: 107,
  },
  title: {
    ...fonts.style.title,
    textAlign: 'center',
    marginBottom: 38,
  },
  link: {
    color: colors.white,
    textDecorationLine: 'underline',
    fontWeight: fonts.weight.bold,
  },
  signupTextContainer: {
    marginTop: 15,
    flexDirection: 'row',
    paddingLeft: 8,
    alignSelf: 'center',
    flexGrow: 0,
  },
  inputsSeparator: {
    height: 28,
  },
  text: {
    color: colors.white,
    fontSize: fonts.size.subtitle,
    fontWeight: fonts.weight.bold,
  },
  mainButtonContainer: {
    position: 'absolute',
    bottom: 34,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
  },
});
