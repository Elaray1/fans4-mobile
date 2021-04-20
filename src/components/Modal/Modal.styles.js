import { StyleSheet, Dimensions } from 'react-native';

import colors from 'themes/colors';
import fonts from 'themes/fonts';

const { width } = Dimensions.get('window');

const MODAL_WIDTH = 270;

export default StyleSheet.create({
  modal: {
    width: MODAL_WIDTH,
    position: 'absolute',
    borderRadius: 13,
    left: (width - MODAL_WIDTH) / 2,
    top: '35%',
    backgroundColor: colors.grayBackground,
  },
  background: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.main,
    opacity: 0.5,
  },
  info: {
    paddingHorizontal: 16,
    paddingVertical: 22,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    color: colors.black,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.semiBold,
    fontSize: fonts.size.regular,
    lineHeight: fonts.lineHeight.regular,
    marginBottom: 9,
  },
  text: {
    textAlign: 'center',
    color: colors.black,
    fontFamily: fonts.family.base,
    fontSize: fonts.size.small,
    lineHeight: fonts.lineHeight.small,
  },
  buttons: {
    flexDirection: 'row',
  },
  button: {
    paddingVertical: 11,
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: colors.borderModal,
  },
  borderRight: {
    borderRightColor: colors.borderModal,
    borderRightWidth: 1,
  },
  buttonSecondaryText: {
    textAlign: 'center',
    color: colors.secondaryModalButton,
    fontSize: fonts.size.regular,
    lineHeight: fonts.lineHeight.regular,
  },
  buttonPrimaryText: {
    textAlign: 'center',
    color: colors.primaryModalButton,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.semiBold,
    fontSize: fonts.size.regular,
    lineHeight: fonts.lineHeight.regular,
  },
});
