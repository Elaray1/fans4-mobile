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
  fans4Container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  fans4Image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 24,
  },
  fans4FullName: {
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
    marginBottom: 4,
  },
  fans4Text: {
    color: colors.textSecondary,
    fontFamily: fonts.family.medium,
    fontWeight: fonts.weight.medium,
    fontSize: fonts.size.caption,
  },
  fans4AboutTitle: {
    marginBottom: 12,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
    fontSize: fonts.size.small,
  },
  fans4AboutContainer: {
    marginBottom: 12,
  },
  line: {
    backgroundColor: colors.line,
    height: 1,
  },
  blockTitle: {
    fontSize: fonts.size.small,
    lineHeight: fonts.lineHeight.small,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
  },
  postsTitle: {
    paddingVertical: 18,
  },
  loaderWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
});
