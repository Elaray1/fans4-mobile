import React from 'react';
import PropTypes from 'prop-types';
import { View, Modal, Pressable, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

import TickIcon from 'assets/icons/tick-white.svg';

import Text from 'components/Text';

import styles from './styles';

function GenderSelectModal({ gender, onClose, onSelect, visible, genders }) {
  const { t } = useTranslation();

  const gendersView = genders.map((item) => {
    const isSelected = item._id === gender?._id;

    const selectItem = () => {
      onSelect(item);
    };

    return (
      <TouchableOpacity
        key={item._id}
        activeOpacity={0.8}
        onPress={selectItem}
      >
        <View style={styles.listItem}>
          <Text style={styles.listItem}>{item.label}</Text>
          {isSelected && <TickIcon />}
        </View>
      </TouchableOpacity>
    );
  });

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.background} onPress={onClose} />

      <View style={styles.modal}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.headerCancel}>{t('GenderSelectModal.cancel')}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('GenderSelectModal.selectGender')}</Text>
          <View style={styles.headerEmptyBlock} />
        </View>

        <ScrollView>
          {gendersView}
        </ScrollView>
      </View>
    </Modal>
  );
}

GenderSelectModal.propTypes = {
  gender: PropTypes.shape(),
  genders: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

GenderSelectModal.defaultProps = {
  gender: null,
};

export default React.memo(GenderSelectModal);
