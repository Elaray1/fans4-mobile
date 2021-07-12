import { StyleSheet } from 'react-native';
import { commonStyles } from 'themes/commonStyles';
import colors from 'themes/colors';
import fonts from 'themes/fonts';

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
  // titleText: {
  //   textAlign: 'center',
  //   marginBottom: 4,
  //   fontFamily: fonts.family.bold,
  //   fontWeight: fonts.weight.bold,
  // },
  // text: {
  //   textAlign: 'center',
  //   fontSize: fonts.size.caption,
  //   color: colors.textSecondary,
  //   fontWeight: fonts.weight.medium,
  // },
  line: {
    width: '100%',
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.whiteBackground,
    position: 'absolute',
    bottom: 0,
  },
  progress: {
    backgroundColor: colors.primary,
    height: 10,
    borderRadius: 5,
  },
  live: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 28,
    left: 22,
    backgroundColor: colors.primary,
    width: 75,
    height: 28,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
    paddingLeft: 6,
    borderRadius: 5,
  },
  event: {
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: colors.gray,
    paddingBottom: 16,
    textAlign: 'center',
  },
  photoImage: {
    width: '100%',
    height: 128,
  },
  eventImageContainer: {
    position: 'relative',
    width: '100%',
    height: 128,
    marginBottom: 16,
  },
});
