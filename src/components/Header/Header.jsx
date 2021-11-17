import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';

import Text from 'components/Text';

import { ITEM_TYPES } from './Header.constants';
import { GetHeaderItem } from './Header.helpers';

import styles from './Header.styles';

function Header({
  title,
  titleIcon,
  onTitlePress,
  leftItem,
  rightItem,
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
  leftItemImageUrl,
  rightItemImageUrl,
  leftItemStyle,
  rightItemStyle,
  isBottomLine,
}) {
  const leftItemProps = {
    onPress: leftItemDisabled ? null : onLeftItemPress,
    style: leftItemStyle,
    imageUrl: leftItemImageUrl,
  };
  const rightItemProps = {
    onPress: rightItemDisabled ? null : onRightItemPress,
    style: rightItemStyle,
    imageUrl: rightItemImageUrl,
  };

  const updatedLeftItem = leftItem || GetHeaderItem({
    type: leftItemType,
    props: leftItemProps,
    text: leftItemText,
    icon: leftItemIcon,
  });
  const updatedRightItem = rightItem || GetHeaderItem({
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
        {updatedLeftItem}
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
        {updatedRightItem}
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
  leftItem: PropTypes.node,
  rightItem: PropTypes.node,
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
  leftItemImageUrl: PropTypes.string,
  rightItemImageUrl: PropTypes.string,
  leftItemStyle: PropTypes.shape(),
  rightItemStyle: PropTypes.shape(),
  titleIcon: PropTypes.shape(),
};

Header.defaultProps = {
  onTitlePress: null,
  isBottomLine: true,
  leftItem: null,
  rightItem: null,
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
  leftItemImageUrl: '',
  rightItemImageUrl: '',
  leftItemStyle: {},
  rightItemStyle: {},
  titleIcon: null,
};

export default React.memo(Header);
