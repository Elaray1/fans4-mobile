import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import Text from 'components/Text';

import { ITEM_TYPES } from './Header.constants';
import { getHeaderItem } from './Header.helpers';

import styles from './Header.styles';

function Header({
  title,
  leftItemType,
  rightItemType,
  onLeftItemPress,
  onRightItemPress,
  leftItemText,
  rightItemText,
  leftItemStyle,
  rightItemStyle,
  isBottomLine,
}) {
  const leftItemProps = { onPress: onLeftItemPress, style: leftItemStyle };
  const rightItemProps = { onPress: onRightItemPress, style: rightItemStyle };

  const leftItem = getHeaderItem({
    type: leftItemType,
    props: leftItemProps,
    text: leftItemText,
  });
  const rightItem = getHeaderItem({
    type: rightItemType,
    props: rightItemProps,
    text: rightItemText,
  });

  return (
    <View style={styles.headerWrapper}>
      <View style={styles.header}>
        {leftItem}
        <Text style={styles.title}>{title}</Text>
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
  isBottomLine: PropTypes.bool,
  title: PropTypes.string.isRequired,
  leftItemType: PropTypes.oneOf([...Object.values(ITEM_TYPES), null]),
  rightItemType: PropTypes.oneOf([...Object.values(ITEM_TYPES), null]),
  onLeftItemPress: PropTypes.func,
  onRightItemPress: PropTypes.func,
  leftItemText: PropTypes.string,
  rightItemText: PropTypes.string,
  leftItemStyle: PropTypes.shape(),
  rightItemStyle: PropTypes.shape(),
};

Header.defaultProps = {
  isBottomLine: true,
  leftItemType: null,
  rightItemType: null,
  onLeftItemPress: null,
  onRightItemPress: null,
  leftItemText: '',
  rightItemText: '',
  leftItemStyle: {},
  rightItemStyle: {},
};

export default React.memo(Header);
