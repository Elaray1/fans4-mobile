import React from 'react';
import PropTypes from 'prop-types';
import {
  View, TouchableOpacity, Modal, Pressable,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import GaleryIcon from 'assets/icons/galery';
import CameraIcon from 'assets/icons/camera';

import Text from 'components/Text';

import styles from './styles';

function UploadingMethodModal({
  onClose,
  visible,
  onUploadFromGallery,
  onUploadFromCamera,
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
              style={[styles.settingsOption, styles.firstSettingsOption]}
              onPress={onUploadFromGallery}
              activeOpacity={0.7}
            >
              <GaleryIcon style={styles.settingIcon} />
              <Text style={styles.settingTitle}>
                {t('UploadingMethodModal.uploadFromGallery')}
              </Text>
            </TouchableOpacity>
            <View style={styles.line} />
          </View>

          <View>
            <TouchableOpacity
              style={styles.settingsOption}
              onPress={onUploadFromCamera}
              activeOpacity={0.7}
            >
              <CameraIcon style={styles.settingIcon} />
              <Text style={styles.settingTitle}>
                {t('UploadingMethodModal.openCamera')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

UploadingMethodModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  onUploadFromGallery: PropTypes.func.isRequired,
  onUploadFromCamera: PropTypes.func.isRequired,
};

export default React.memo(UploadingMethodModal);
