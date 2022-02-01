import { StyleSheet } from 'react-native';
import { commonStyles } from 'themes/commonStyles';
import colors from 'themes/colors';
import fonts from 'themes/fonts';

import hexToRgba from 'helpers/hexToRgba';

export default StyleSheet.create({
  screen: {
    ...commonStyles.screen,
  },
  content: {
    ...commonStyles.screenContent,
    marginTop: 30,
  },
  noSubscriptions: {
    flex: 1,
    alignItems: 'center',
  },
  illustration: {
    width: 250,
    height: 250,
    backgroundColor: colors.gray,
    marginBottom: 50,
  },
  titleText: {
    marginBottom: 20,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
  },
  titleEvent: {
    textAlign: 'center',
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
  },
  text: {
    textAlign: 'center',
    fontSize: fonts.size.caption,
    color: colors.textSecondary,
    fontWeight: fonts.weight.medium,
  },
  captionText: {
    fontSize: fonts.size.caption,
  },
  imageContainer: {
    position: 'relative',
  },
  winner: {
    position: 'absolute',
    bottom: 4,
    left: 23,
    paddingHorizontal: 9,
    paddingVertical: 1,
    backgroundColor: colors.primary,
    borderRadius: 9,
  },
  winnerText: {
    fontSize: fonts.size.tiny,
    fontWeight: fonts.weight.medium,
  },
  winnerImage: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  posterLabel: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    left: 12,
    bottom: 12,
    width: 252,
    paddingRight: 32,
    paddingLeft: 10,
    paddingVertical: 6,
    backgroundColor: hexToRgba(colors.gray, 0.5),
    borderRadius: 5,
  },
  posterLabelText: {
    marginLeft: 5,
    fontSize: fonts.size.caption,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
  },
  streamFinished: {
    width: undefined,
    paddingLeft: 12,
    paddingRight: 12,
  },
  event: {
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 5,
    marginBottom: 16,
    textAlign: 'center',
  },
  photoImage: {
    width: '100%',
  },
  eventImageContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: 16,
  },
  imageStatus: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  imageText: {
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
    fontSize: fonts.size.caption,
  },
  stayTuned: {
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 8,
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
  finishedVideoContainer: {
    width: 0,
    height: 0,
    overflow: 'hidden',
  },
});
