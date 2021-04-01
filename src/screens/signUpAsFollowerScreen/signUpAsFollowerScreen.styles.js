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
  titleContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  title: {
    ...fonts.style.title,
    textAlign: 'center',
    marginBottom: 20,
  },
  backButtonContainer: {
    position: 'absolute',
    left: 0,
  },
  link: {
    color: colors.white,
    textDecorationLine: 'underline',
    fontWeight: fonts.weight.bold,
  },
  signinTextContainer: {
    marginTop: 15,
    flexDirection: 'row',
    paddingLeft: 8,
    alignSelf: 'center',
    flexGrow: 0,
  },
  signinText: {
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
