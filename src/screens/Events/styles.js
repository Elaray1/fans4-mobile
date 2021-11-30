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
  event: {
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: colors.gray,
    paddingBottom: 16,
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
  photoImage: {
    width: '100%',
    height: 128,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 128,
    marginBottom: 16,
  },
  imageStatus: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  imageText: {
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
    fontSize: fonts.size.caption,
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
    bottom: 22,
    left: 12,
    backgroundColor: colors.primaryRed,
    width: 75,
    height: 28,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
    paddingLeft: 6,
    borderRadius: 5,
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
