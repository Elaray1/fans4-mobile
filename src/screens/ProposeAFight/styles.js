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
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
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
    position: 'absolute',
    left: '43%',
    alignSelf: 'center',
    color: colors.disabledText,
    fontSize: fonts.size.caption,
    marginHorizontal: 18,
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
    maxWidth: 130,
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
  fighter: {
    alignItems: 'center',
  },
  firstFighter: {
    marginLeft: 40,
  },
  secondFighter: {
    marginRight: 40,
  },
});
