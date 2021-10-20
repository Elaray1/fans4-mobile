import { StyleSheet } from 'react-native';
import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  subscribedButton: {
    height: 40,
    marginBottom: 20,
    marginTop: 20,
  },
  noMargin: {
    marginBottom: 0,
  },
  blockedSupportedFighterText: {
    color: colors.grayText,
    fontWeight: fonts.weight.medium,
    fontSize: fonts.size.caption,
  },
  applyButton: {
    height: 40,
  },
  applyButtonMargin: {
    marginBottom: 20,
  },
  proposeAFightButton: {
    backgroundColor: 'transparent',
    borderColor: colors.primary,
    borderWidth: 1,
  },
  proposeAFightTitle: {
    color: colors.primary,
  },
  line: {
    backgroundColor: colors.line,
    height: 1,
    marginBottom: 20,
  },
});
