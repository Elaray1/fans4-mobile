import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  View, TouchableOpacity, Modal, Pressable,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import TrashIcon from 'assets/icons/trash';
import EditIcon from 'assets/icons/pencil';

import Text from 'components/Text';

import styles from './styles';

function EditPostModal({
  onClose,
  visible,
  isRemovedByAdmin,
  onRemoveFromFeed,
  onEdit,
}) {
  const { t } = useTranslation();

  const onRemove = useCallback(() => {
    onRemoveFromFeed(isRemovedByAdmin);
  }, [onRemoveFromFeed, isRemovedByAdmin]);

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
          {!isRemovedByAdmin && onEdit && (
            <View>
              <TouchableOpacity
                style={[styles.settingsOption, styles.firstSettingsOption]}
                onPress={onEdit}
                activeOpacity={0.7}
              >
                <EditIcon style={styles.settingIcon} />
                <Text style={styles.settingTitle}>
                  {t('Post.edit')}
                </Text>
              </TouchableOpacity>
              <View style={styles.line} />
            </View>
          )}

          <View>
            <TouchableOpacity
              style={[styles.settingsOption, !onEdit && styles.firstSettingsOption]}
              onPress={onRemove}
              activeOpacity={0.7}
            >
              <TrashIcon style={styles.settingIcon} />
              <Text style={styles.settingTitle}>
                {isRemovedByAdmin ? t('Post.removeFromFeed') : t('Post.delete')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

EditPostModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  isRemovedByAdmin: PropTypes.bool.isRequired,
  onRemoveFromFeed: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
};

EditPostModal.defaultProps = {
  onEdit: null,
};

export default React.memo(EditPostModal);
