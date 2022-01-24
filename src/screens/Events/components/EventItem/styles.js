import { StyleSheet } from 'react-native';
import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  event: {
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: colors.gray,
    paddingBottom: 16,
  },
  photoImage: {
    width: '100%',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: 16,
  },
  imageStatus: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  imageText: {
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
    fontSize: fonts.size.caption,
  },
  progress: {
    backgroundColor: colors.primary,
    height: 10,
    borderBottomLeftRadius: 5,
  },
  live: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 20,
    left: 10,
    backgroundColor: colors.primaryRed,
    width: 82,
    height: 28,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
    paddingLeft: 6,
    borderRadius: 5,
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
});
