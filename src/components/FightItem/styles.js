import { StyleSheet } from 'react-native';
import colors from 'themes/colors';
import fonts from 'themes/fonts';
import hexToRgba from 'helpers/hexToRgba';

export default StyleSheet.create({
  fight: {
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: colors.gray,
    paddingVertical: 16,
    paddingHorizontal: 11.5,
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
    alignSelf: 'flex-end',
    marginHorizontal: 4,
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
  votesContainer: {
    width: '33%',
  },
  votes: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 5,
    backgroundColor: hexToRgba(colors.primary, 0.12),
    alignSelf: 'center',
  },
  votesText: {
    fontSize: fonts.size.caption,
    fontWeight: fonts.weight.medium,
    color: colors.primary,
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
