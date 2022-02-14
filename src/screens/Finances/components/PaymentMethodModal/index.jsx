import React from 'react';
import PropTypes from 'prop-types';
import {
  View, TouchableOpacity, Modal, Pressable,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import Text from 'components/Text';

import EditIcon from 'assets/icons/pencil';
import TrashIcon from 'assets/icons/trash';

import styles from './styles';

function PaymentMethodModal({
  onClose,
  visible,
  onUpdatePaymentMethod,
  onDeletePaymentMethod,
}) {
  const { t } = useTranslation();

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
          <View>
            <TouchableOpacity
              style={styles.settingsOption}
              onPress={onUpdatePaymentMethod}
              activeOpacity={0.7}
            >
              <EditIcon style={styles.settingIcon} />
              <Text style={styles.settingTitle}>
                {t('PaymentMethodModal.updatePaymentMethod')}
              </Text>
            </TouchableOpacity>
            <View style={styles.line} />
          </View>

          <View>
            <TouchableOpacity
              style={styles.settingsOption}
              onPress={onDeletePaymentMethod}
              activeOpacity={0.7}
            >
              <TrashIcon style={styles.settingIcon} />
              <Text style={styles.settingTitle}>
                {t('PaymentMethodModal.deletePaymentMethod')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

PaymentMethodModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  onUpdatePaymentMethod: PropTypes.func.isRequired,
  onDeletePaymentMethod: PropTypes.func.isRequired,
};

export default React.memo(PaymentMethodModal);
