import { StyleSheet } from 'react-native';
import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 70,
  },
  text: {
    fontSize: fonts.size.h4,
    fontWeight: fonts.weight.bold,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 74,
  },
  fight: {
    paddingTop: 65,
    paddingBottom: 40,
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
});
