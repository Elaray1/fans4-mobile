import { StyleSheet } from 'react-native';

import colors from 'themes/colors';
import fonts from 'themes/fonts';

export default StyleSheet.create({
  tabBarView: {
    height: 90,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopColor: colors.line,
    borderTopWidth: 1,
  },
  tabButtonView: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    marginTop: 6,
    fontFamily: fonts.family.base,
    fontWeight: fonts.weight.medium,
    fontSize: fonts.size.tiny,
    lineHeight: 14,
    color: colors.tabBarInactive,
  },
  focused: {
    color: colors.tabBarActive,
  },
});
