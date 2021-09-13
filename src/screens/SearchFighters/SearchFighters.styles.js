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
  fighterImage: {
    height: 54,
    width: 54,
    borderRadius: 100,
    marginRight: 16,
  },
  fightersList: {
    marginTop: 18,
  },
  fighter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    backgroundColor: colors.line,
    height: 1,
    marginVertical: 10,
  },
  fullName: {
    fontSize: fonts.size.small,
    lineHeight: fonts.lineHeight.small,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
  },
  nickname: {
    fontSize: fonts.size.caption,
    lineHeight: fonts.lineHeight.small,
  },
  city: {
    color: colors.grayText,
    fontSize: fonts.size.caption,
    lineHeight: fonts.lineHeight.caption,
  },
  loader: {
    paddingVertical: 10,
  },
  emptyView: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 20,
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
    fontSize: fonts.size.small,
    color: colors.textSecondary,
    fontWeight: fonts.weight.medium,
  },
  fans4Container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray,
    borderRadius: 5,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 27,
  },
  fans4Image: {
    width: 54,
    height: 54,
    marginRight: 16,
    borderRadius: 50,
  },
  fans4FullName: {
    fontSize: fonts.size.small,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
  },
  fans4Text: {
    marginTop: 4,
    fontSize: fonts.size.caption,
    color: colors.textSecondary,
  },
  proBadge: {
    backgroundColor: colors.primaryRed,
    height: 14,
    width: 13,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    borderRadius: 4,
    top: 2,
    left: 42,
  },
  proBadgeText: {
    fontSize: fonts.size.verySmall,
    fontFamily: fonts.family.boldItalic,
    fontWeight: fonts.weight.bold,
  },
});
