import { StyleSheet } from 'react-native';

import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 112,
    backgroundColor: colors.gray,
    borderRadius: 5,
    marginVertical: 5,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: 5,
  },
  textContainer: {
    justifyContent: 'space-between',
    height: 80,
    paddingVertical: 16,
    flex: 1,
    paddingLeft: 16,
  },
  name: {
    fontSize: fonts.size.small,
    fontWeight: fonts.weight.bold,
    fontFamily: fonts.family.bold,
  },
  location: {
    fontSize: fonts.size.caption,
    color: colors.disabledText,
  },
  nickname: {
    fontSize: fonts.size.caption,
  },
  opacity: {
    opacity: 0.5,
  },
  grayImage: {
    opacity: 0.4,
  },
  selected: {
    borderColor: 'white',
    borderWidth: 1,
  },
  disabledTextContainer: {
    paddingVertical: 0,
  },
  fightingStatus: {
    paddingVertical: 2,
    paddingHorizontal: 12,
    borderRadius: 5,
    backgroundColor: colors.fightingStatusBadge,
    alignSelf: 'flex-start',
  },
  fightingStatusText: {
    color: colors.fightingStatusText,
    fontSize: fonts.size.caption,
    textTransform: 'capitalize',
  },
});
