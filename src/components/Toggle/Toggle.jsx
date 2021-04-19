import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';

import Text from 'components/Text';

import styles from './Toggle.styles';

function Toggle({
  leftOption,
  rightOption,
  selectedOptionId,
  onSelect,
}) {
  const onOptionPress = useCallback(id => () => onSelect(id), [onSelect]);

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={[styles.option, selectedOptionId === leftOption.id && styles.selectedOption]}
        activeOpacity={1}
        onPress={onOptionPress(leftOption.id)}
      >
        <Text style={styles.optionText}>{leftOption.value}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.option, selectedOptionId === rightOption.id && styles.selectedOption]}
        activeOpacity={1}
        onPress={onOptionPress(rightOption.id)}
      >
        <Text style={styles.optionText}>{rightOption.value}</Text>
      </TouchableOpacity>
    </View>
  );
}

Toggle.propTypes = {
  leftOption: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
  rightOption: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
  selectedOptionId: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};


export default React.memo(Toggle);
