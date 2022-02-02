import React from 'react';
import PropTypes from 'prop-types';
import {
  View, TouchableOpacity, Modal, Pressable,
} from 'react-native';

import Text from 'components/Text';

import styles from './styles';

function EditCommentModal({
  onClose,
  visible,
  onEdit,
  title,
  OptionIcon,
}) {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.background} onPress={onClose} />
      <View style={styles.modal}>
        <View>
          {onEdit && (
            <View>
              <TouchableOpacity
                style={[styles.settingsOption, styles.firstSettingsOption]}
                onPress={onEdit}
                activeOpacity={0.7}
              >
                <View style={styles.settingIcon}>
                  <OptionIcon />
                </View>
                <Text style={styles.settingTitle}>
                  {title}
                </Text>
              </TouchableOpacity>
              <View style={styles.line} />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

EditCommentModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  OptionIcon: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
};

EditCommentModal.defaultProps = {
  onEdit: null,
};

export default React.memo(EditCommentModal);
