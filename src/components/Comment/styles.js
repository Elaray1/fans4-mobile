import { StyleSheet } from 'react-native';
import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  commentContainer: {
    marginBottom: 16,
  },
  commentLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  firstLine: {
    marginBottom: 12,
  },
  fullNameContainer: {
    flexDirection: 'row',
  },
  fullNameText: {
    fontSize: fonts.size.small,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
  },
  youText: {
    fontSize: fonts.size.small,
    fontWeight: fonts.weight.medium,
    color: colors.textSecondary,
  },
  secondaryText: {
    color: colors.textSecondary,
    fontSize: fonts.size.caption,
    fontWeight: fonts.weight.medium,
    maxWidth: 240,
  },
  date: {
    alignSelf: 'flex-end',
  },
  line: {
    backgroundColor: colors.line,
    height: 1,
    marginTop: 16,
  },
  actions: {
    position: 'absolute',
    right: 20,
    zIndex: 1,
    elevation: 1,
    minWidth: 183,
    paddingVertical: 16,
    paddingLeft: 20,
    backgroundColor: colors.gray,
    borderRadius: 5,
  },
  actionsText: {
    fontSize: fonts.size.small,
    fontWeight: fonts.weight.medium,
  },
  closeModal: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  dotButton: {
    padding: 4,
    margin: -4,
  },
});
