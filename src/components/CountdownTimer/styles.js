import { StyleSheet, Platform } from 'react-native';
import colors from 'themes/colors';
import fonts from 'themes/fonts';

import hexToRgba from 'helpers/hexToRgba';

const isIOS = Platform.OS === 'ios';

export default StyleSheet.create({
  container: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: colors.main,
  },
  header: {
    position: 'absolute',
    top: isIOS ? 47 : 0,
    width: '100%',
    zIndex: 1,
    elevation: 1,
  },
  countdownWrapper: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
  },
  countdown: {
    width: '100%',
  },
  posterImage: {
    borderRadius: 5,
    position: 'absolute',
    width: '100%',
  },
  posterBackgroundColor: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: hexToRgba(colors.gray, 0.5),
  },
  countdownTextContainer: {
    height: 250,
    justifyContent: 'center',
  },
  countdownTitle: {
    fontSize: fonts.size.h1,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
    lineHeight: 50,
    textAlign: 'center',
  },
  countdownText: {
    fontSize: fonts.size.caption,
    textAlign: 'center',
  },
});
