import { StyleSheet, Dimensions } from 'react-native';

import colors from 'themes/colors';
import fonts from 'themes/fonts';

import hexToRgba from 'helpers/hexToRgba';

import { variables } from 'themes/commonStyles';

const { width } = Dimensions.get('window');

const progressBarWidth = width - variables.paddingHorizontal * 2;

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
    fontFamily: fonts.family.bold,
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
  streamFullScreenIconContainer: {
    backgroundColor: null,
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
  live: {
    flexDirection: 'row',
    backgroundColor: colors.primaryRed,
    width: 82,
    height: 28,
    alignItems: 'center',
    paddingLeft: 12,
    borderRadius: 5,
  },
  notLive: {
    backgroundColor: colors.textSecondary,
  },
  liveContainer: {
    position: 'absolute',
    bottom: 42,
    left: 20,
  },
  timeAndLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveText: {
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
    marginLeft: 5,
    color: colors.white,
    lineHeight: 16,
  },
  backButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonWrapper: {
    backgroundColor: colors.gray,
    width: 32,
    height: 32,
    borderRadius: 5,
  },
  topContainer: {
    position: 'absolute',
    top: 45,
    left: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    marginLeft: -72,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
    color: colors.white,
    fontSize: fonts.size.regular,
  },
  progressBarContainer: {
    alignItems: 'flex-end',
    width: progressBarWidth,
    height: 10,
    marginTop: 12,
    borderRadius: 5,
    backgroundColor: colors.white,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: hexToRgba(colors.gray, 0.7),
  },
  timeContainer: {
    height: 28,
    justifyContent: 'center',
    backgroundColor: hexToRgba(colors.gray, 0.5),
    paddingHorizontal: 12,
    marginLeft: 20,
    borderRadius: 5,
  },
  time: {
    color: colors.white,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
    fontSize: fonts.size.caption,
  },
});
