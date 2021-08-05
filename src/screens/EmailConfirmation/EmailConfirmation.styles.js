import { StyleSheet } from 'react-native';
import colors from 'themes/colors';
import { commonStyles } from 'themes/commonStyles';

import fonts from 'themes/fonts';

export default StyleSheet.create({
  screen: {
    ...commonStyles.screen,
  },
  content: {
    ...commonStyles.screenContent,
  },
  scrollContent: {
    paddingTop: 100,
    paddingBottom: 35,
    flex: 1,
    justifyContent: 'space-between',
  },
  logo: {
    marginBottom: 85,
    alignSelf: 'center',
  },
  title: {
    marginBottom: 53,
    textAlign: 'center',
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
  },
  text: {
    textAlign: 'center',
    fontSize: fonts.size.small,
    color: colors.textSecondary,
  },
  textWrapper: {},
  linkButton: {
    alignSelf: 'center',
    marginTop: 15,
  },
  emailSent: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    backgroundColor: colors.buttonNotification,
    borderRadius: 5,
  },
  checkmarkBox: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    width: 16,
    height: 16,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  emailSentText: {
    color: colors.primary,
  },
});
