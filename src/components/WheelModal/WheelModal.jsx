import PropTypes from 'prop-types';
import React, { useState, useCallback } from 'react';
import {
  View, TouchableOpacity, Modal, Pressable,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Picker } from 'react-native-wheel-pick';

import Text from 'components/Text';

import colors from 'themes/colors';

import styles from './WheelModal.styles';

function WheelModal({
  onClose, onSubmit, visible, initialValue, options,
}) {
  const { t } = useTranslation();
  const [internalValue, setInternalDate] = useState(initialValue);

  const onDonePress = useCallback(() => {
    onSubmit(internalValue);
  }, [internalValue, onSubmit]);

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.background} onPress={onClose} />
      <View style={styles.modal}>
        <TouchableOpacity
          style={styles.doneButton}
          onPress={onDonePress}
          activeOpacity={0.8}
        >
          <Text style={styles.doneText}>{t('WheelModal.done')}</Text>
        </TouchableOpacity>
        <View style={styles.line} />
        <Picker
          style={styles.picker}
          textColor={colors.white}
          selectedValue={internalValue}
          pickerData={options}
          onValueChange={setInternalDate}
          itemSpace={30}
          // this cause message about invalid prop
          // but it's still required to change text color in IOS
          itemStyle={styles.itemStyle}
        />
      </View>
    </Modal>
  );
}

WheelModal.propTypes = {
  initialValue: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default React.memo(WheelModal);
