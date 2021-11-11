import { StyleSheet } from 'react-native';
import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  time: {
    backgroundColor: colors.timerHeader,
    marginHorizontal: -12,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    paddingVertical: 2,
    marginBottom: 16,
  },
  timeText: {
    fontSize: fonts.size.caption,
    textAlign: 'center',
  },
});
