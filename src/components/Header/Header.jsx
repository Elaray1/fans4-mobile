import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';

import Text from 'components/Text';

import { ITEM_TYPES } from './Header.constants';
import { getHeaderItem } from './Header.helpers';

import styles from './Header.styles';

function Header({
  title,
  titleIcon,
  onTitlePress,
  leftItemType,
  rightItemType,
  onLeftItemPress,
  onRightItemPress,
  leftItemText,
  rightItemText,
  leftItemIcon,
  rightItemIcon,
  leftItemDisabled,
  rightItemDisabled,
  leftItemStyle,
  rightItemStyle,
  isBottomLine,
}) {
  const leftItemProps = {
    onPress: leftItemDisabled ? null : onLeftItemPress,
    style: leftItemStyle,
  };
  const rightItemProps = {
    onPress: rightItemDisabled ? null : onRightItemPress,
    style: rightItemStyle,
  };

  const leftItem = getHeaderItem({
    type: leftItemType,
    props: leftItemProps,
    text: leftItemText,
    icon: leftItemIcon,
  });
  const rightItem = getHeaderItem({
    type: rightItemType,
    props: rightItemProps,
    text: rightItemText,
    icon: rightItemIcon,
  });

  const headerTitle = useMemo(() => (
    <>
      <Text style={styles.title}>{title}</Text>
      {titleIcon}
    </>
  ), [title, titleIcon]);

  return (
    <View style={styles.headerWrapper}>
      <View style={styles.header}>
        {leftItem}
        {onTitlePress
          ? (
            <TouchableOpacity
              onPress={onTitlePress}
              activeOpacity={0.7}
              style={titleIcon && styles.headerTitleConteiner}
            >
              {headerTitle}
            </TouchableOpacity>
          )
          : (
            <View style={titleIcon && styles.headerTitleConteiner}>
              {headerTitle}
            </View>
          )}
        {rightItem}
      </View>
      {isBottomLine && (
      <View
        style={[styles.line, { marginTop: (leftItemType || rightItemType) ? 18 : 23 }]}
      />
      )}
    </View>
  );
}

Header.propTypes = {
  onTitlePress: PropTypes.func,
  isBottomLine: PropTypes.bool,
  title: PropTypes.string.isRequired,
  leftItemType: PropTypes.oneOf([...Object.values(ITEM_TYPES), null]),
  rightItemType: PropTypes.oneOf([...Object.values(ITEM_TYPES), null]),
  onLeftItemPress: PropTypes.func,
  onRightItemPress: PropTypes.func,
  leftItemText: PropTypes.string,
  rightItemText: PropTypes.string,
  leftItemIcon: PropTypes.func,
  rightItemIcon: PropTypes.func,
  leftItemDisabled: PropTypes.bool,
  rightItemDisabled: PropTypes.bool,
  leftItemStyle: PropTypes.shape(),
  rightItemStyle: PropTypes.shape(),
  titleIcon: PropTypes.shape(),
};

Header.defaultProps = {
  onTitlePress: null,
  isBottomLine: true,
  leftItemType: null,
  rightItemType: null,
  onLeftItemPress: null,
  onRightItemPress: null,
  leftItemText: '',
  rightItemText: '',
  leftItemIcon: null,
  rightItemIcon: null,
  leftItemDisabled: false,
  rightItemDisabled: false,
  leftItemStyle: {},
  rightItemStyle: {},
  titleIcon: null,
};

export default React.memo(Header);
