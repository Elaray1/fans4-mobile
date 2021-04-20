import PropTypes from 'prop-types';
import React from 'react';
import {
  View,
  Modal as RNModal,
  Pressable,
} from 'react-native';

import Text from 'components/Text';


import styles from './Modal.styles';

function Modal({
  visible, onClose, onSubmit,
  title, text, buttonSecondaryText, buttonPrimaryText,
}) {
  return (
    <RNModal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.background}
        onPress={onClose}
      />
      <View style={styles.modal}>
        <View style={styles.info}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.text}>{text}</Text>
        </View>
        <View style={styles.buttons}>
          <Pressable
            onPress={onClose}
            style={[styles.button, styles.borderRight]}
          >
            <Text style={styles.buttonSecondaryText}>{buttonSecondaryText}</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={onSubmit}
          >
            <Text style={styles.buttonPrimaryText}>{buttonPrimaryText}</Text>
          </Pressable>
        </View>
      </View>
    </RNModal>
  );
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  buttonSecondaryText: PropTypes.string.isRequired,
  buttonPrimaryText: PropTypes.string.isRequired,
};

Modal.defaultProps = {
};

export default React.memo(Modal);
