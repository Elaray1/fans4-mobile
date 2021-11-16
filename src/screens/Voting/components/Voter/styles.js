import { StyleSheet } from 'react-native';
import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  text: {
    marginTop: 100,
    marginHorizontal: 20,
    fontSize: fonts.size.h4,
    fontWeight: fonts.weight.bold,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 94,
  },
  fight: {
    paddingTop: 65,
    paddingBottom: 40,
    height: 400,
  },
  button: {
    borderColor: colors.primary,
    borderWidth: 2,
    height: 64,
    width: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    marginTop: 20,
    marginBottom: 20,
  },
  litedButton: {
    backgroundColor: colors.lightButton,
  },
});
