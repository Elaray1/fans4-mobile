import { StyleSheet, Dimensions } from 'react-native';

import colors from 'themes/colors';
import fonts from 'themes/fonts';
import { variables } from 'themes/commonStyles';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  modal: {
    flex: 15,
    width,
    justifyContent: 'flex-end',
    backgroundColor: colors.main,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  background: {
    flex: 1,
    backgroundColor: colors.main,
    opacity: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 25,
    paddingBottom: 12,
    backgroundColor: colors.bigModalHeader,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    // without it scrollbar is not on the end of the screen
    paddingHorizontal: variables.paddingHorizontal,
  },
  headerCancel: {
    color: colors.primary,
    fontSize: fonts.size.small,
    lineHeight: fonts.lineHeight.small,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
  },
  headerTitle: {
    fontSize: fonts.size.regular,
    lineHeight: fonts.lineHeight.regular,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
  },
  headerEmptyBlock: {
    width: 50,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    // without it scrollbar is not on the end of the screen
    paddingHorizontal: variables.paddingHorizontal,
  },
  listItemCity: {
    color: colors.white,
    fontSize: fonts.size.small,
    lineHeight: fonts.lineHeight.small,
    fontFamily: fonts.family.base,
    fontWeight: fonts.weight.medium,
  },
  line: {
    backgroundColor: colors.line,
    height: 1,
    // without it scrollbar is not on the end of the screen
    marginHorizontal: variables.paddingHorizontal,
  },
  emptyWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fonts.size.small,
    lineHeight: fonts.lineHeight.small,
    fontFamily: fonts.family.base,
    fontWeight: fonts.weight.medium,
    marginBottom: 24,
  },
  loader: {
    paddingVertical: 10,
  },
});
