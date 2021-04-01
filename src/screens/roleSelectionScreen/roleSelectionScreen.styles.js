import { StyleSheet } from 'react-native';

import colors from 'themes/colors';
import fonts from 'themes/fonts';


export default StyleSheet.create({
  container: {
    backgroundColor: colors.black,
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginTop: 169,
    marginBottom: 107,
  },
  title: {
    ...fonts.style.title,
    textAlign: 'center',
    marginBottom: 38,
  },
});
