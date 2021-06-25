import PropTypes from 'prop-types';
import React, {
  useCallback,
  useState,
} from 'react';
import {
  View,
  Modal,
  Pressable,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import { useTranslation } from 'react-i18next';

import { FAN_GENDERS } from 'resources/user/user.constants';

import Text from 'components/Text';

import TickIcon from 'assets/icons/tick.svg';

import styles from './styles';

function GenderModal({
  onClose, onSubmit, visible, gender,
}) {
  const { t } = useTranslation();

  const genders = Object.values(FAN_GENDERS);

  const genderToTag = {
    [FAN_GENDERS.MALE]: t('genderPicker.male'),
    [FAN_GENDERS.FEMALE]: t('genderPicker.female'),
    [FAN_GENDERS.NONBINARY]: t('genderPicker.nonbinary'),
    [FAN_GENDERS.OTHER]: t('genderPicker.other'),
    [FAN_GENDERS.PREFER_NOT_TO_SAY]: t('genderPicker.preferNotToSay'),
  };

  const [selectedGender, setSelectedGender] = useState(gender);

  const renderItem = ({ item }) => {
    const isSelected = item === selectedGender;
    const selectItem = () => {
      setSelectedGender(item);
      onSubmit(item);
    };
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={selectItem}
      >
        <View style={styles.listItem}>
          <Text style={styles.listItemCity}>{genderToTag[item]}</Text>
          {isSelected && <TickIcon />}
        </View>
      </TouchableOpacity>
    );
  };

  const renderItemSeparator = () => <View style={styles.line} />;

  const keyExtractor = useCallback(item => item, []);

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.background} onPress={onClose} />
      <View style={styles.modal}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.headerCancel}>{t('CitySelectModal.cancel')}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('CitySelectModal.selectHometown')}</Text>
          <View style={styles.headerEmptyBlock} />
        </View>
        <FlatList
          data={genders}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={renderItemSeparator}
          initialNumToRender={25}
        />
      </View>
    </Modal>
  );
}

GenderModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  gender: PropTypes.string.isRequired,
};

export default React.memo(GenderModal);
