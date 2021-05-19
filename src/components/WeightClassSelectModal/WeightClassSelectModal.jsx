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
} from 'react-native';

import { useTranslation } from 'react-i18next';

import Text from 'components/Text';
import CheckBox from 'components/Checkbox';

import styles from './WeightClassSelectModal.styles';

function CitySelectModal({
  onClose, onSubmit, visible, isFemale,
}) {
  const { t } = useTranslation();

  const maleWeightClasses = [
    {
      _id: 1,
      name: t('WeightClassSelectModal.Flyweight'),
      label: t('WeightClassSelectModal.FlyweightWithWeight'),
      isChecked: false,
    },
    {
      _id: 2,
      name: t('WeightClassSelectModal.Bantamweight'),
      label: t('WeightClassSelectModal.BantamweightWithWeight'),
      isChecked: false,
    },
    {
      _id: 3,
      name: t('WeightClassSelectModal.Featherweight'),
      label: t('WeightClassSelectModal.FeatherweightWithWeight'),
      isChecked: false,
    },
    {
      _id: 4,
      name: t('WeightClassSelectModal.Lightweight'),
      label: t('WeightClassSelectModal.LightweightWithWeight'),
      isChecked: false,
    },
    {
      _id: 5,
      name: t('WeightClassSelectModal.Welterweight'),
      label: t('WeightClassSelectModal.WelterweightWithWeight'),
      isChecked: false,
    },
    {
      _id: 6,
      name: t('WeightClassSelectModal.Middleweight'),
      label: t('WeightClassSelectModal.MiddleweightWithWeight'),
      isChecked: false,
    },
    {
      _id: 7,
      name: t('WeightClassSelectModal.LightHeavyweight'),
      label: t('WeightClassSelectModal.LightHeavyweightWithWeight'),
      isChecked: false,
    },
    {
      _id: 8,
      name: t('WeightClassSelectModal.Heavyweight'),
      label: t('WeightClassSelectModal.HeavyweightWithWeight'),
      isChecked: false,
    },
    {
      _id: 9,
      name: t('WeightClassSelectModal.SuperHeavyweight'),
      label: t('WeightClassSelectModal.SuperHeavyweightWithWeight'),
      isChecked: false,
    },
  ];

  const femaleWeightClasses = [{
    _id: 1,
    name: t('WeightClassSelectModal.Strawweight'),
    label: t('WeightClassSelectModal.StrawweightWithWeight'),
    isChecked: false,
  },
  {
    _id: 2,
    name: t('WeightClassSelectModal.Flyweight'),
    label: t('WeightClassSelectModal.FlyweightWithWeight'),
    isChecked: false,
  },
  {
    _id: 3,
    name: t('WeightClassSelectModal.Bantamweight'),
    label: t('WeightClassSelectModal.BantamweightWithWeight'),
    isChecked: false,
  },
  {
    _id: 4,
    name: t('WeightClassSelectModal.Featherweight'),
    label: t('WeightClassSelectModal.FeatherweightWithWeight'),
    isChecked: false,
  },
  ];

  const [weightClasses, setWeightClasses] = useState(
    isFemale ? femaleWeightClasses : maleWeightClasses,
  );

  const onCheckBoxPress = useCallback((item) => {
    if (weightClasses.filter(c => c.isChecked).length < 3 || item.isChecked) {
      setWeightClasses(cs => cs.map(c => (
        c._id === item._id ? { ...c, isChecked: !c.isChecked } : c
      )));
    }
  }, [weightClasses]);

  const onSave = useCallback(() => onSubmit(weightClasses.filter(i => i.isChecked)),
    [onSubmit, weightClasses]);

  const isAnyWeightClassSelected = !weightClasses.some((i => i.isChecked));

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
            <Text style={styles.headerCancel}>{t('WeightClassSelectModal.cancel')}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('WeightClassSelectModal.chooseWeightClass')}</Text>
          <View style={styles.headerEmptyBlock} />
          <TouchableOpacity
            onPress={onSave}
            activeOpacity={0.7}
            disabled={isAnyWeightClassSelected}
          >
            <Text style={{
              ...styles.headerCancel,
              ...(isAnyWeightClassSelected && styles.disabledButton),
            }}
            >
              {t('WeightClassSelectModal.save')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.listContainer}>
          <Text style={styles.description}>{t('WeightClassSelectModal.description')}</Text>
          {weightClasses.map(item => (
            <View key={item._id} style={styles.checkBoxContainer}>
              <CheckBox
                label={item.label}
                value={item.isChecked}
                onChangeValue={() => onCheckBoxPress(item)}
              />
            </View>
          ))}
        </View>
      </View>
    </Modal>
  );
}

CitySelectModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  isFemale: PropTypes.bool.isRequired,
};

export default React.memo(CitySelectModal);
