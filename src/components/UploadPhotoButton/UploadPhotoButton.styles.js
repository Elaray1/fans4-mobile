import { StyleSheet, Dimensions } from 'react-native';

import colors from 'themes/colors';
import { variables } from 'themes/commonStyles';
import fonts from 'themes/fonts';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  buttonWrapper: {
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 5,
    width: '100%',
    backgroundColor: colors.gray,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    color: colors.white,
    fontFamily: fonts.family.base,
    fontWeight: fonts.weight.medium,
    fontSize: fonts.size.small,
  },
  label: {
    marginBottom: 6,
    color: colors.white,
    opacity: 0.4,
    fontSize: fonts.size.caption,
    fontFamily: fonts.family.base,
    fontWeight: fonts.weight.medium,
    lineHeight: fonts.lineHeight.caption,
  },
  photoImage: {
    borderRadius: 5,
    width: width - variables.paddingHorizontal * 2,
    height: width - variables.paddingHorizontal * 2,
  },
  redBin: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  error: {

  },
  errorText: {
    color: colors.error,
    fontSize: fonts.size.caption,
    fontFamily: fonts.family.base,
    fontWeight: fonts.weight.medium,
    lineHeight: fonts.lineHeight.caption,
  },
});
