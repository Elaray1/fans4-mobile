import colors from 'themes/colors';
import fonts from 'themes/fonts';
import { Platform } from 'react-native';

const commonStyles = {
  screen: {
    flex: 1,
    backgroundColor: colors.main,
  },
  screenContent: {
    flex: 1,
    marginHorizontal: 20,
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

export default commonStyles;
