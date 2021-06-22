import { StyleSheet } from 'react-native';
import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    width: 270,
  },
  background: {
    flex: 1,
    backgroundColor: 'rgba(30,30,30, 0.5)',
  },
  modalContent: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 19,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(242, 242, 242, 1)',
    borderRadius: 14,
    width: 270,
  },
  title: {
    textAlign: 'center',
    color: colors.defaultBlack,
    fontWeight: fonts.weight.bold,
    marginBottom: 9,
  },
  text: {
    textAlign: 'center',
    color: colors.defaultBlack,
    fontSize: fonts.size.small,
    marginBottom: 16,
  },
  next: {
    color: colors.borderModal,
    fontWeight: fonts.weight.bold,
  },
  nextWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 270,
    paddingVertical: 10,
    borderTopColor: colors.borderModal,
    borderTopWidth: 1,
  },
  buttonsWrapper: {
    borderTopColor: colors.disabledText,
    borderTopWidth: 1,
    width: 270,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
  },
  cancelButton: {
    borderRightWidth: 1,
    borderRightColor: colors.disabledText,
  },
  buttonsText: {
    color: colors.secondaryModalButton,
    fontWeight: fonts.weight.bold,
  },
  cancelText: {
    fontWeight: 'normal',
  },
  addButtonStyles: {
    flexDirection: 'column',
    borderTopWidth: 0,
  },
  addButton: {
    borderTopWidth: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
});
