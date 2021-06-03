import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';

import Text from 'components/Text';

import styles from './Toggle.styles';

function Toggle({
  items,
  selectedItemId,
  onSelect,
}) {
  const onItemPress = useCallback((item) => {
    if (item.onSelect) {
      item.onSelect();
    }
    onSelect(item.id);
  }, [onSelect]);

  return (
    <View style={styles.wrapper}>
      {items.map(item => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.option,
            { width: `${100 / items.length}%` },
            item.id === selectedItemId && styles.selectedOption,
          ]}
          activeOpacity={1}
          onPress={() => onItemPress(item)}
        >
          <Text style={styles.optionText}>{item.value}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

Toggle.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onSelect: PropTypes.func,
  })).isRequired,
  selectedItemId: PropTypes.string.isRequired,
  onSelect: PropTypes.func,
};

Toggle.defaultProps = {
  onSelect: () => null,
};


export default React.memo(Toggle);
