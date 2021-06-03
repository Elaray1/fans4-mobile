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
  fight: {
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: colors.gray,
    paddingVertical: 16,
    paddingHorizontal: 11.5,
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
  photoImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginBottom: 8,
  },
  fightersInfo: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fighters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  captionText: {
    fontSize: fonts.size.caption,
  },
  vs: {
    alignSelf: 'flex-end',
    marginHorizontal: 4,
  },
  fighter: {
    alignItems: 'center',
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
    justifyContent: 'space-between',
  },
  imageContainer: {
    position: 'relative',
  },
  winner: {
    position: 'absolute',
    bottom: 0,
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
