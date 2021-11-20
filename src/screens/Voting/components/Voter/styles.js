import { StyleSheet } from 'react-native';
import colors from 'themes/colors';
import fonts from 'themes/fonts';
import metrics from 'themes/metrics';

export default StyleSheet.create({
  container: {
    justifyContent: 'center',
    height: metrics.screenHeight - metrics.tabBarHeight,
  },
  text: {
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
  helper: {
    position: 'absolute',
    top: 65,
    fontSize: fonts.size.h1,
    fontWeight: fonts.weight.bold,
    zIndex: 2,
  },
  yes: {
    left: 65,
    transform: [{ rotate: '-10deg' }],
    color: colors.primaryRed,
  },
  no: {
    right: 65,
    transform: [{ rotate: '10deg' }],
  },
});
