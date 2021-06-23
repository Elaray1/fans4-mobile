import { StyleSheet } from 'react-native';
import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  applyButton: {
    height: 40,
  },
  createdFightContainer: {
    backgroundColor: colors.buttonNotification,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    width: '100%',
  },
  createdFightText: {
    lineHeight: 20,
    color: colors.primary,
    fontWeight: fonts.weight.medium,
    fontSize: fonts.size.caption,
    marginLeft: 5,
  },
  cannotApplyForAFightText: {
    color: colors.grayText,
    fontWeight: fonts.weight.medium,
    fontSize: fonts.size.caption,
  },
  createdFightTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
