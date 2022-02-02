import { StyleSheet, Dimensions } from 'react-native';

import colors from 'themes/colors';
import fonts from 'themes/fonts';
import { variables } from 'themes/commonStyles';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.main,
    opacity: 0.5,
  },
  modal: {
    width,
    paddingHorizontal: variables.paddingHorizontal,
    justifyContent: 'flex-end',
    backgroundColor: colors.gray,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 28,
    paddingBottom: 27,
  },
  firstSettingsOption: {
    paddingVertical: null,
    paddingBottom: 15,
  },
  settingsOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  settingIcon: {
    marginRight: 16,
  },
  settingTitle: {
    color: colors.white,
    fontSize: fonts.size.small,
    lineHeight: fonts.lineHeight.small,
    fontFamily: fonts.family.base,
    fontWeight: fonts.weight.medium,
  },
  line: {
    backgroundColor: colors.line,
    height: 1,
  },
});
