import { StyleSheet, Dimensions } from 'react-native';
import colors from 'themes/colors';
import fonts from 'themes/fonts';
import { variables } from 'themes/commonStyles';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  message: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    maxWidth: width - variables.paddingHorizontal * 2 - 40,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 8,
    backgroundColor: colors.gray,
    borderRadius: 5,
  },
  senderMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.message,
  },
  text: {
    marginRight: 12,
    fontSize: fonts.size.small,
    fontFamily: fonts.family.base,
    fontWeight: fonts.weight.medium,
  },
  time: {
    alignSelf: 'flex-end',
    color: colors.textSecondary,
    fontSize: fonts.size.caption,
    fontFamily: fonts.family.base,
    fontWeight: fonts.weight.medium,
  },
});
