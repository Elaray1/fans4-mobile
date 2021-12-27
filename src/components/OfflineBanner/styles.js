import { StyleSheet, Platform } from 'react-native';

import colors from 'themes/colors';
import fonts from 'themes/fonts';

const isIOS = Platform.OS === 'ios';

export default StyleSheet.create({
  bannerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: isIOS ? 56 : 20,
    paddingBottom: 16,
    backgroundColor: colors.offlineBannerBackground,
  },
  bannerText: {
    marginLeft: 18,
    fontFamily: fonts.family.base,
    fontWeight: fonts.weight.medium,
    color: colors.primary,
  },
  bannerWrapper: {
    backgroundColor: colors.main,
  },
});
