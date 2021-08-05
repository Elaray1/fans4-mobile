import { Platform } from 'react-native';

const isIOS = Platform.OS === 'ios';

const family = {
  // for iOS it should be FontFamily that identical for those both fonts
  base: isIOS ? 'Noto Sans' : 'NotoSans-Regular',
  bold: isIOS ? 'Noto Sans' : 'NotoSans-Bold',
};

const size = {
  great: 56,
  huge: 46,
  big: 40,
  h1: 32,
  h2: 28,
  h3: 22,
  h4: 20,
  medium: 18,
  regular: 16,
  small: 14,
  caption: 12,
  tiny: 10,
};

const weight = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
};

const lineHeight = {
  huge: 56,
  big: 38,
  medium: 30,
  regular: 22,
  small: 19,
  caption: 16,
};

export default {
  family,
  size,
  weight,
  lineHeight,
};
