import React from 'react';
import PropTypes from 'prop-types';
import {
  View, TouchableOpacity, Modal, Pressable,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import GaleryIcon from 'assets/icons/galery';
import CameraIcon from 'assets/icons/camera';
import VideoCameraIcon from 'assets/icons/video-camera';

import Text from 'components/Text';

import styles from './styles';

function UploadingMethodModal({
  onClose,
  visible,
  onUploadFromGallery,
  onUploadPhotoFromCamera,
  onUploadVideoFromCamera,
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
              onPress={onUploadPhotoFromCamera}
              activeOpacity={0.7}
            >
              <CameraIcon style={styles.settingIcon} />
              <Text style={styles.settingTitle}>
                {t('UploadingMethodModal.takeAPhotoFromCamera')}
              </Text>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity
              style={styles.settingsOption}
              onPress={onUploadVideoFromCamera}
              activeOpacity={0.7}
            >
              <VideoCameraIcon style={styles.settingIcon} />
              <Text style={styles.settingTitle}>
                {t('UploadingMethodModal.recordVideoFromCamera')}
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
  onUploadPhotoFromCamera: PropTypes.func.isRequired,
  onUploadVideoFromCamera: PropTypes.func.isRequired,
};

export default React.memo(UploadingMethodModal);
