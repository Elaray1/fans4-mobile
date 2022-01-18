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
  },
  noSubscriptions: {
    flex: 1,
    alignItems: 'center',
  },
  illustration: {
    width: 250,
    height: 250,
    marginVertical: 50,
  },
  titleText: {
    marginBottom: 20,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
  },
  text: {
    textAlign: 'center',
    fontSize: fonts.size.small,
    color: colors.textSecondary,
    fontWeight: fonts.weight.medium,
  },
  emptyScroll: {
    flexGrow: 1,
  },
  loader: {
    margin: 15,
  },
  posts: {
    marginTop: 20,
    marginBottom: 20,
  },
  separator: {
    height: 16,
  },
  watchLiveStreamBannerContainerOnBottom: {
    marginTop: 16,
  },
  watchLiveStreamBannerContainerOnTop: {
    marginBottom: 16,
  },
});
