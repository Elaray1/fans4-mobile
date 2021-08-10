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
  disabledButton: {
    opacity: 0.5,
  },
  headerTitle: {
    marginLeft: 20,
    fontSize: fonts.size.regular,
    lineHeight: fonts.lineHeight.regular,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
  },
  description: {
    fontSize: fonts.size.small,
    lineHeight: fonts.lineHeight.small,
    fontFamily: fonts.family.base,
    fontWeight: fonts.weight.medium,
    marginTop: 44,
    marginBottom: 33,
  },
  listContainer: {
    height: '90%',
    paddingHorizontal: 20,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: colors.line,
  },
});
