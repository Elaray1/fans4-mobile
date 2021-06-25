import { StyleSheet } from 'react-native';
import colors from 'themes/colors';
import fonts from 'themes/fonts';

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
  votes: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 5,
    backgroundColor: colors.buttonNotification,
  },
  votesText: {
    fontSize: fonts.size.caption,
    fontWeight: fonts.weight.medium,
    color: colors.primary,
  },
  fanVoted: {
    backgroundColor: colors.buttonNotification,
    borderRadius: 5,
    height: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fanVotedText: {
    color: colors.primary,
    fontSize: fonts.size.caption,
  },
  button: {
    height: 40,
  },
});
