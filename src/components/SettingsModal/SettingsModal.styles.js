import { StyleSheet, Dimensions } from 'react-native';

import colors from 'themes/colors';
import fonts from 'themes/fonts';
import { variables } from 'themes/commonStyles';

const { width, height } = Dimensions.get('window');

const VERY_SMALL_SCREEN_HEIGHT = 568;

const logOutButton = {
  paddingTop: 30,
  paddingBottom: 50,
  alignItems: 'center',
};

if (height <= VERY_SMALL_SCREEN_HEIGHT) {
  logOutButton.paddingTop = 20;
  logOutButton.paddingBottom = 20;
}

export default StyleSheet.create({
  modal: {
    width,
    paddingHorizontal: variables.paddingHorizontal,
    justifyContent: 'flex-end',
    backgroundColor: colors.gray,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  background: {
    flex: 1,
    backgroundColor: colors.main,
    opacity: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 30,
  },
  title: {
    color: colors.white,
    fontSize: fonts.size.regular,
    lineHeight: fonts.lineHeight.regular,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
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
  settingText: {
    color: colors.textSecondary,
    fontSize: fonts.size.caption,
    lineHeight: fonts.lineHeight.small,
    fontFamily: fonts.family.base,
    fontWeight: fonts.weight.medium,
  },
  line: {
    backgroundColor: colors.line,
    height: 1,
  },
  logOutText: {
    color: colors.white,
    fontSize: fonts.size.small,
    lineHeight: fonts.lineHeight.small,
    fontFamily: fonts.family.base,
    fontWeight: fonts.weight.medium,
  },
  logOutButton,
});
