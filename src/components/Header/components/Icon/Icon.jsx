import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import BackArrowIcon from 'assets/icons/back-arrow';
import MenuIcon from 'assets/icons/menu';

import { ITEM_TYPES } from 'components/Header/Header.constants';

import styles from './Icon.styles';

function Icon({
  icon,
  onPress,
  style,
  type,
}) {
  const navigation = useNavigation();

  const onBackNavigation = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  let IconItem = null;
  switch (type) {
    case ITEM_TYPES.BACK_ARROW:
      IconItem = BackArrowIcon;
      break;
    case ITEM_TYPES.MENU:
      IconItem = MenuIcon;
      break;
    case ITEM_TYPES.ICON:
      IconItem = icon;
      break;
    default:
      break;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress || onBackNavigation}
      style={[styles.iconButtonWrapper, style]}
    >
      <View style={styles.iconButton}>
        <IconItem />
      </View>
    </TouchableOpacity>
  );
}

Icon.propTypes = {
  icon: PropTypes.func,
  onPress: PropTypes.func,
  style: PropTypes.shape(),
  type: PropTypes.oneOf([ITEM_TYPES.BACK_ARROW, ITEM_TYPES.MENU, ITEM_TYPES.ICON]),
};

Icon.defaultProps = {
  icon: null,
  onPress: null,
  style: {},
  type: ITEM_TYPES.BACK_ARROW,
};

export default React.memo(Icon);
