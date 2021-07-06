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
    backgroundColor: colors.gray,
    marginBottom: 50,
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
});
