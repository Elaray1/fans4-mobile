import { StyleSheet } from 'react-native';
import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  iosFailedPaymentBanner: {
    paddingTop: 30,
    paddingBottom: 18,
    paddingHorizontal: 20,
    backgroundColor: colors.errorBackground2,
  },
  iosFailedPaymentBannerText: {
    color: colors.error,
    fontSize: fonts.size.small,
    textAlign: 'center',
  },
});
