import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  View, TouchableOpacity,
} from 'react-native';

import Text from 'components/Text';

import ArrowUpIcon from 'assets/icons/arrow-up';
import ArrowDownIcon from 'assets/icons/arrow-down';

import styles from './Question.styles';

function Question({ title, text }) {
  const [isOpen, setIsOpen] = useState(false);

  const onPress = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
      </View>
      {isOpen && <Text style={styles.text}>{text}</Text>}
    </TouchableOpacity>
  );
}

Question.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default React.memo(Question);
