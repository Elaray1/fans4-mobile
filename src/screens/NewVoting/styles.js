import { StyleSheet } from 'react-native';
import { commonStyles } from 'themes/commonStyles';
import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  screen: {
    ...commonStyles.screen,
  },
  image: {
    width: 335,
    height: 315,
    marginBottom: 34,
    opacity: 0.5,
  },
  content: {
    marginTop: 70,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  bigText: {
    fontSize: fonts.size.h1,
    fontWeight: fonts.weight.bold,
    position: 'absolute',
    zIndex: 2,
    top: 135,
  },
  text: {
    fontSize: fonts.size.small,
    color: colors.grayText,
    textAlign: 'center',
  },
});
