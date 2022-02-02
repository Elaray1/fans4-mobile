import { StyleSheet } from 'react-native';
import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  commentContainer: {
    paddingTop: 18,
    paddingHorizontal: 20,
  },
  commentLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fullNameContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dateContainer: {
    flexDirection: 'row',
  },
  fullNameText: {
    fontSize: fonts.size.small,
    color: colors.textSecondary,
  },
  secondaryText: {
    color: colors.textSecondary,
    fontSize: fonts.size.caption,
    maxWidth: 230,
  },
  commentText: {
    fontSize: fonts.size.small,
    color: colors.white,
    paddingBottom: 8,
  },
  date: {
    alignSelf: 'flex-end',
    marginRight: 24,
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
    backgroundColor: colors.gray,
    borderRadius: 5,
  },
  clickableArea: {
    paddingVertical: 16,
    paddingLeft: 20,
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
