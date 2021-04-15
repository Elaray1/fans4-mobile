import colors from 'themes/colors';
import fonts from 'themes/fonts';
import { Platform } from 'react-native';

export const variables = {
  paddingHorizontal: 20,
};

export const commonStyles = {
  screen: {
    flex: 1,
    backgroundColor: colors.main,
    paddingHorizontal: variables.paddingHorizontal,
  },
  screenContent: {
    flex: 1,
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
    fontWeight: fonts.weight.bold,
    fontSize: fonts.size.tiny,
  },
};
