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
  emptyView: {
    flex: 1,
    alignItems: 'center',
  },
  illustration: {
    width: 250,
    height: 250,
    marginVertical: 50,
  },
  titleText: {
    textAlign: 'center',
    marginBottom: 4,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
  },
  text: {
    textAlign: 'center',
    fontSize: fonts.size.caption,
    color: colors.textSecondary,
    fontWeight: fonts.weight.medium,
  },
  scrollView: {
    flexGrow: 1,
  },
  votingText: {
    marginLeft: 3,
  },
  votingContainer: {
    paddingVertical: 4,
    paddingLeft: 6,
    paddingRight: 10,
    flexDirection: 'row',
    backgroundColor: colors.gray,
    borderRadius: 5,
    marginLeft: -40,
  },
  votingCardsIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    backgroundColor: colors.primaryRed,
    borderRadius: 5,
  },
  loader: {
    margin: 15,
  },
});
