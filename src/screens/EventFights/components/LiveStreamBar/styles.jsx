import { StyleSheet } from 'react-native';
import colors from 'themes/colors';

export default StyleSheet.create({
  line: {
    width: '100%',
    height: 10,
    backgroundColor: colors.whiteBackground,
    position: 'absolute',
    bottom: 0,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  progress: {
    backgroundColor: colors.primary,
    height: 10,
    borderBottomLeftRadius: 5,
  },
  live: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 28,
    left: 22,
    backgroundColor: colors.primaryRed,
    width: 75,
    height: 28,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
    paddingLeft: 6,
    borderRadius: 5,
  },
});
