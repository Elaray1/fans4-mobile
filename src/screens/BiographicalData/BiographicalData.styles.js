import { StyleSheet } from 'react-native';
import { commonStyles, variables } from 'themes/commonStyles';

import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  screen: {
    ...commonStyles.screen,
  },
  content: {
    ...commonStyles.screenContent,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: 50,
  },
  inputLabel: {
    color: colors.white,
    opacity: 0.4,
    fontSize: fonts.size.caption,
    fontFamily: fonts.family.base,
    fontWeight: fonts.weight.medium,
    lineHeight: fonts.lineHeight.caption,
  },
  inputContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    height: 56,
    borderRadius: 5,
    paddingHorizontal: 16,
    marginTop: 6,
    marginBottom: 20,
    backgroundColor: colors.gray,
  },
  input: {
    flex: 1,
    color: colors.white,
    fontFamily: fonts.family.base,
    fontSize: fonts.size.small,
    fontWeight: fonts.weight.medium,
  },
});
