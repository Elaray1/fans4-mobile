import { StyleSheet } from 'react-native';

import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 5,
    width: '100%',
    backgroundColor: colors.greyInputs,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    color: colors.white,
    fontWeight: fonts.weight.medium,
    fontSize: fonts.size.small,
  },
  label: {
    alignSelf: 'flex-start',
    marginVertical: 6,
    color: colors.white,
    opacity: 0.4,
  },
});
