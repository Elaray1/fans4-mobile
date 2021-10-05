import { StyleSheet } from 'react-native';
import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  chat: {
    borderColor: colors.primaryButtonText,
    borderBottomWidth: 1,
    paddingVertical: 16,
    flexDirection: 'row',
  },
  time: {
    color: colors.tabBarInactive,
    fontSize: fonts.size.caption,
  },
  name: {
    fontSize: fonts.size.small,
    fontWeight: fonts.weight.bold,
  },
  message: {
    fontSize: fonts.size.caption,
  },
  counter: {
    width: 18,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: colors.link,
  },
  counterText: {
    fontSize: fonts.size.tiny,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topRow: {
    marginBottom: 4,
  },
  photoImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 8,
  },
  chatInfo: {
    flex: 1,
  },
});
