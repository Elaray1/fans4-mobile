import { StyleSheet } from 'react-native';

import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  container: {
    overflow: 'hidden',
    width: '100%',
    borderRadius: 5,
  },
  poster: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  titleContainer: {
    padding: 14,
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  isLiveText: {
    color: colors.black,
    fontSize: fonts.size.small,
    fontWeight: fonts.weight.regular,
  },
  watchLiveText: {
    color: colors.link,
    fontSize: fonts.size.regular,
    fontWeight: fonts.weight.bold,
  },
  live: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    backgroundColor: colors.primaryRed,
    width: 75,
    height: 28,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
    paddingLeft: 6,
    borderRadius: 5,
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
