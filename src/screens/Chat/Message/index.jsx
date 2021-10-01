import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
} from 'react-native';
import moment from 'moment';

import Text from 'components/Text';

import styles from './styles';

function Message({ text, time, isSender }) {
  return (
    <View style={[styles.message, isSender && styles.senderMessage]}>
      <Text style={styles.text}>{text}</Text>
      <Text style={styles.time}>{moment(time).format('h:mm a')}</Text>
    </View>
  );
}

Message.propTypes = {
  text: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  isSender: PropTypes.bool.isRequired,
};

export default React.memo(Message);
