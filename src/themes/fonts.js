import colors from './colors';

const family = {
  base: 'Avenir',
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

const style = {
  header: {
    fontSize: size.header,
    fontWeight: weight.bold,
    color: colors.headerFont,
  },
  title: {
    fontSize: size.title,
    fontWeight: weight.semiBold,
    color: colors.fontTitle,
  },
  subtitle: {
    fontSize: size.subtitle,
    fontWeight: weight.semiBold,
  },
  text: {
    fontSize: size.regular,
    fontWeight: weight.regular,
  },
  error: {
    fontSize: size.tiny,
    color: colors.error,
  },
};

export default {
  family,
  size,
  weight,
  style,
};
