import { StyleSheet } from 'react-native';

import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  buttonWrapper: {
    width: '100%',
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
  errorButton: {
    borderWidth: 1,
    borderColor: colors.error,
  },
  text: {
    color: colors.white,
    fontFamily: fonts.family.base,
    fontWeight: fonts.weight.medium,
    fontSize: fonts.size.small,
  },
  label: {
    marginBottom: 6,
    color: colors.textSecondary,
    fontSize: fonts.size.caption,
    fontFamily: fonts.family.base,
    fontWeight: fonts.weight.medium,
    lineHeight: fonts.lineHeight.caption,
  },
  photoImage: {
    borderRadius: 5,
    width: '100%',
    resizeMode: 'contain',
  },
  bin: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  error: {
    marginTop: 5,
  },
  errorText: {
    color: colors.error,
    fontSize: fonts.size.caption,
    fontFamily: fonts.family.base,
    fontWeight: fonts.weight.medium,
    lineHeight: fonts.lineHeight.caption,
  },
});
