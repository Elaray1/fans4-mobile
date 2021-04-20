import colors from 'themes/colors';
import fonts from 'themes/fonts';
import { Platform } from 'react-native';

export const variables = {
  paddingTop: 20,
  paddingHorizontal: 20,
  paddingTopLogo: 140,
};

export const commonStyles = {
  navigator: {
    flex: 1,
    backgroundColor: colors.main,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.main,
  },
  screenContent: {
    flex: 1,
    paddingHorizontal: variables.paddingHorizontal,
  },
  tabBar: {
    borderTopColor: colors.main,
    ...(Platform.OS === 'android' && {
      height: 70,
    }),
  },
  tab: {
    ...(Platform.OS === 'android'
      ? {
        paddingBottom: 13,
        paddingTop: 10,
      }
      : {
        marginTop: 10,
      }
    ),
  },
  labelStyle: {
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
    fontSize: fonts.size.tiny,
  },
};
