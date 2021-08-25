import { StyleSheet } from 'react-native';
import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  imageContainer: {
    position: 'relative',
  },
  winner: {
    position: 'absolute',
    bottom: 4,
    left: 23,
    paddingHorizontal: 9,
    paddingVertical: 1,
    backgroundColor: colors.link,
    borderRadius: 9,
  },
  winnerText: {
    fontSize: fonts.size.tiny,
    fontWeight: fonts.weight.medium,
  },
  winnerImage: {
    borderWidth: 2,
    borderColor: colors.link,
  },
  photoImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginBottom: 8,
  },
  captionText: {
    fontSize: fonts.size.caption,
  },
});
