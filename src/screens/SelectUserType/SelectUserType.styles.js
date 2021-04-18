import { StyleSheet } from 'react-native';
import { commonStyles, variables } from 'themes/commonStyles';

import fonts from 'themes/fonts';

export default StyleSheet.create({
  screen: {
    ...commonStyles.screen,
  },
  content: {
    ...commonStyles.screenContent,
  },
  scrollContent: {
    paddingTop: variables.paddingTopLogo,
    flex: 1,
  },
  fighterButton: {
    marginBottom: 18,
  },
  title: {
    marginBottom: 76,
    textAlign: 'center',
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
  },
  logo: {
    marginBottom: 85,
    alignSelf: 'center',
  },
});
