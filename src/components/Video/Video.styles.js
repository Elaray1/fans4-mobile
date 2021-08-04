import { StyleSheet } from 'react-native';

import colors from 'themes/colors';
import fonts from 'themes/fonts';


export default StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 100,
  },
  fullScreenContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.black,
    height: '100%',
    width: '100%',
  },
  playControlContainer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timingContainer: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    borderRadius: 5,
    backgroundColor: `${colors.gray}7F`, // rgba with opacity 0.5
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
  },
  timingText: {
    marginTop: -2,
    fontSize: fonts.size.caption,
    fontWeight: fonts.weight.bold,
  },
  playedTimeText: {
    color: colors.white,
  },
  durationText: {
    color: colors.grayText,
  },
  toggleFullScreenIconContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    backgroundColor: `${colors.gray}7F`, // rgba with opacity 0.5
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  toggleControlsShowingContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  posterOverVideo: {
    position: 'absolute',
    top: 0,
  },
});
