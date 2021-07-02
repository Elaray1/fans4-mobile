import { StyleSheet } from 'react-native';

import colors from 'themes/colors';
import fonts from 'themes/fonts';

import { commonStyles } from 'themes/commonStyles';

export default StyleSheet.create({
  screen: {
    ...commonStyles.screen,
  },
  content: {
    ...commonStyles.screenContent,
  },
  fightersContainer: {
    height: 115,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  fightersBlock: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  fighterPicturePlaceholder: {
    height: 78,
    width: 136,
    borderColor: colors.disabledText,
    borderRadius: 5,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  vs: {
    color: colors.disabledText,
    fontSize: fonts.size.caption,
    marginHorizontal: 8,
  },
  title: {
    fontSize: fonts.size.small,
    marginTop: 24,
    marginBottom: 16,
  },
  image: {
    height: 60,
    width: 60,
    borderRadius: 5,
    marginBottom: 4,
  },
  caption: {
    fontSize: fonts.size.caption,
  },
  disabled: {
    color: colors.disabledPrimary,
  },
  search: {
    marginBottom: 15,
  },
  emptyView: {
    alignItems: 'center',
    paddingTop: 110,
  },
  showFullListButton: {
    marginTop: 15,
    padding: 10,
  },
  showFullListButtonText: {
    color: colors.primary,
    fontWeight: fonts.weight.bold,
    fontFamily: fonts.family.bold,
  },
  leftBlock: {
    flex: 1,
    alignItems: 'flex-end',
  },
  rightBlock: {
    flex: 1,
  },
  leftFighter: {
    textAlign: 'right',
  },
});
