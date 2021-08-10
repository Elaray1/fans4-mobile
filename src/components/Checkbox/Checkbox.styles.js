import { StyleSheet } from 'react-native';
import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  checkboxWrapper: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  checkbox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
    width: 16,
    height: 16,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: colors.white,
  },
  label: {
    fontSize: fonts.size.small,
    color: colors.white,
    fontWeight: fonts.weight.medium,
  },
  activeCheckbox: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  disabled: {
    color: colors.grayText,
    borderColor: colors.grayText,
  },
});
