import { StyleSheet } from 'react-native';

import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    height: 56,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginTop: 6,
    marginBottom: 20,
    backgroundColor: colors.gray,
  },
  selectedOption: {
    backgroundColor: colors.primary,
  },
  option: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  optionText: {
    marginVertical: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
    textTransform: 'capitalize',
    color: colors.white,
    fontSize: fonts.size.small,
    lineHeight: fonts.lineHeight.small,
    fontFamily: fonts.family.base,
    fontWeight: fonts.weight.medium,
  },
});
