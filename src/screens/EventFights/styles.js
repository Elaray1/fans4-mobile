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
});
