import PropTypes from 'prop-types';
import React, { useState, useCallback } from 'react';
import {
  View, TouchableOpacity, Modal, Pressable, ActivityIndicator,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import { useTranslation } from 'react-i18next';

import Text from 'components/Text';

import colors from 'themes/colors';

import styles from './DatePickerModal.styles';

function DatePickerModal({
  date, onClose, onSubmit, visible, isLoading,
}) {
  const { t } = useTranslation();
  const [internalDate, setInternalDate] = useState(date);

  const onDonePress = useCallback(() => {
    onSubmit(internalDate);
  }, [internalDate, onSubmit]);

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
          disabled={isLoading}
        >
          {!isLoading
            ? <Text style={styles.doneText}>{t('DatePickerModal.done')}</Text>
            : <ActivityIndicator color={colors.primary} />
          }
        </TouchableOpacity>
        <View style={styles.line} />
        <DatePicker
          style={styles.datepicker}
          date={internalDate}
          maximumDate={new Date()}
          onDateChange={setInternalDate}
          androidVariant="iosClone"
          mode="date"
          textColor={colors.white}
          fadeToColor={colors.gray}
          dividerHeight={0}
        />
      </View>
    </Modal>
  );
}

DatePickerModal.propTypes = {
  date: PropTypes.instanceOf(Date),
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool,
};

DatePickerModal.defaultProps = {
  date: new Date('1990-01-01'),
  isLoading: false,
};

export default React.memo(DatePickerModal);
