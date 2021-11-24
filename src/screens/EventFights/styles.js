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
  line: {
    width: '100%',
    height: 10,
    backgroundColor: colors.whiteBackground,
    position: 'absolute',
    bottom: 0,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  progress: {
    backgroundColor: colors.primary,
    height: 10,
    borderBottomLeftRadius: 5,
  },
  live: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 28,
    left: 22,
    backgroundColor: colors.primaryRed,
    width: 75,
    height: 28,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
    paddingLeft: 6,
    borderRadius: 5,
  },
  upcoming: {
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
  upcomingText: {
    marginLeft: 5,
    fontSize: fonts.size.caption,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
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
    height: 168,
  },
  eventImageContainer: {
    position: 'relative',
    width: '100%',
    height: 168,
    marginBottom: 16,
  },
  imageStatus: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  imageText: {
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
  },
  stayTuned: {
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  button: {
    borderRadius: 5,
    backgroundColor: colors.primary,
    width: '100%',
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: colors.primaryButtonText,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
    marginLeft: 4,
  },
  noFightsContainer: {
    marginTop: 41,
    alignItems: 'center',
  },
  noFightsTitle: {
    marginBottom: 20,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
  },
  noFightsText: {
    marginBottom: 20,
    textAlign: 'center',
    color: colors.grayText,
    fontSize: fonts.size.small,
    fontFamily: fonts.family.base,
    fontWeight: fonts.weight.medium,
  },
});
