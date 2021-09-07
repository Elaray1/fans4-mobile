import { StyleSheet } from 'react-native';
import { commonStyles } from 'themes/commonStyles';
import hexToRgba from 'helpers/hexToRgba';
import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  screen: {
    ...commonStyles.screen,
  },
  title: {
    fontSize: fonts.size.medium,
  },
  illustrationContainer: {
    marginTop: 0,
    marginBottom: 35,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  inactiveDot: {
    backgroundColor: 'transparent',
    width: 10,
    height: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.primary,
  },
  pagination: {
    marginTop: -40,
    paddingBottom: 10,
  },
  backArrow: {
    position: 'absolute',
    top: 45,
    left: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: hexToRgba(colors.gray, 0.5),
    zIndex: 1,
    elevation: 1,
  },
});
