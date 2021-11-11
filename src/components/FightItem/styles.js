import { StyleSheet } from 'react-native';
import colors from 'themes/colors';
import fonts from 'themes/fonts';
import hexToRgba from 'helpers/hexToRgba';

export default StyleSheet.create({
  fight: {
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: colors.gray,
    paddingBottom: 16,
    paddingHorizontal: 12,
  },
  fightersInfo: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fighters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  firstFighter: {
    alignItems: 'flex-end',
  },
  fighter: {
    width: '50%',
  },
  vs: {
    alignSelf: 'center',
    marginHorizontal: 26,
  },
  time: {
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    marginBottom: 20,
  },
  captionText: {
    fontSize: fonts.size.caption,
  },
  line: {
    width: '100%',
    height: 1,
    marginVertical: 12,
    backgroundColor: colors.line,
  },
  location: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    textAlign: 'center',
    fontSize: fonts.size.caption,
    color: colors.textSecondary,
    fontWeight: fonts.weight.medium,
  },
  locationText: {
    width: '33%',
  },
  locationTextLeft: {
    textAlign: 'left',
  },
  locationTextRight: {
    textAlign: 'right',
  },
  votes: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  percentageBar: {
    width: 125,
    height: 12,
    flexDirection: 'row',
  },
  grayTriangele: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderBottomWidth: 12,
    borderLeftWidth: 8,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.textSecondary,
    borderLeftColor: 'transparent',
  },
  redTriangele: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderBottomWidth: 12,
    borderLeftWidth: 8,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.primaryRed,
    borderLeftColor: colors.textSecondary,
  },
  blackTriangele: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderBottomWidth: 12,
    borderLeftWidth: 8,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: colors.primaryRed,
  },
  percentageNo: {
    backgroundColor: colors.textSecondary,
    height: '100%',
  },
  percentageYes: {
    backgroundColor: colors.primaryRed,
    height: '100%',
  },
  fightType: {
    color: colors.textSecondary,
    fontSize: fonts.size.caption,
  },
  votesText: {
    fontSize: fonts.size.caption,
    color: colors.primary,
  },
  votesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexBasis: '30%',
  },
  centerContainer: {
    flexBasis: '40%',
  },
  checkMark: {
    marginHorizontal: 6,
  },
  rightVotesContainer: {
    justifyContent: 'flex-end',
  },
  fanVoted: {
    backgroundColor: hexToRgba(colors.link, 0.12),
    borderRadius: 5,
    height: 40,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fanVotedText: {
    marginLeft: 8,
    color: colors.link,
    fontSize: fonts.size.caption,
  },
  voted: {
    backgroundColor: hexToRgba(colors.white, 0.12),
    borderRadius: 5,
    height: 40,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  votedText: {
    marginLeft: 8,
    color: colors.white,
    fontSize: fonts.size.caption,
  },
  button: {
    height: 40,
  },
  upcoming: {
    backgroundColor: hexToRgba(colors.green, 0.12),
    borderRadius: 5,
    height: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upcomingText: {
    color: colors.green,
    fontSize: fonts.size.caption,
  },
  declined: {
    backgroundColor: hexToRgba(colors.error, 0.12),
    borderRadius: 5,
    height: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  declinedText: {
    color: colors.error,
    fontSize: fonts.size.caption,
  },
  pending: {
    backgroundColor: colors.fightingStatusBadge,
    borderRadius: 5,
    height: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingText: {
    color: colors.fightingStatusText,
    fontSize: fonts.size.caption,
  },
});
