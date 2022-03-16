import { StyleSheet } from 'react-native';
import { commonStyles } from 'themes/commonStyles';

import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  loadingView: {
    flex: 1,
    backgroundColor: colors.main,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  screen: {
    ...commonStyles.screen,
  },
  content: {
    ...commonStyles.screenContent,
  },
  scrollView: {
    marginBottom: 10,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  text: {
    fontSize: fonts.size.caption,
    color: colors.grayText,
    paddingBottom: 30,
  },
  title: {
    fontSize: fonts.size.small,
    fontWeight: fonts.weight.bold,
    marginBottom: 20,
  },
  logoutButton: {
    marginBottom: 20,
    marginTop: 20,
  },
  webview: {
    backgroundColor: colors.black,
  },
  updatedTermsWarningContainer: {
    backgroundColor: colors.offlineBannerBackground,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  updatedTermsWarning: {
    marginLeft: 16,
    color: colors.white,
    fontWeight: fonts.weight.medium,
    fontSize: fonts.size.small,
    flexShrink: 1,
  },
});
