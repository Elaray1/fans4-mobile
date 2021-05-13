import PropTypes from 'prop-types';
import React, {
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

  const allWeightClasses = [
    {
      _id: 1,
      name: t('WeightClassSelectModal.Strawweight'),
      weight: 115,
      isChecked: false,
    },
    {
      _id: 2,
      name: t('WeightClassSelectModal.Flyweight'),
      weight: 125,
      isChecked: false,
    },
    {
      _id: 3,
      name: t('WeightClassSelectModal.Bantamweight'),
      weight: 135,
      isChecked: false,
    },
    {
      _id: 4,
      name: t('WeightClassSelectModal.Featherweight'),
      weight: 145,
      isChecked: false,
    },
    {
      _id: 5,
      name: t('WeightClassSelectModal.Lightweight'),
      weight: 155,
      isChecked: false,
    },
    {
      _id: 6,
      name: t('WeightClassSelectModal.Welterweight'),
      weight: 170,
      isChecked: false,
    },
    {
      _id: 7,
      name: t('WeightClassSelectModal.Middleweight'),
      weight: 185,
      isChecked: false,
    },
    {
      _id: 8,
      name: t('WeightClassSelectModal.LightHeavyweight'),
      weight: 205,
      isChecked: false,
    },
    {
      _id: 9,
      name: t('WeightClassSelectModal.Heavyweight'),
      weight: 265,
      isChecked: false,
    },
    {
      _id: 10,
      name: t('WeightClassSelectModal.SuperHeavyweight'),
      weight: 265,
      isChecked: false,
    },
  ];

  const maleWeightClasses = allWeightClasses.slice(1);
  const femaleWeightClasses = allWeightClasses.slice(0, 4);


  const [weightClasses, setWeightClasses] = useState(
    isFemale ? femaleWeightClasses : maleWeightClasses,
  );

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
            onPress={() => onSubmit(weightClasses.filter(i => i.isChecked))}
            activeOpacity={0.7}
            disabled={!weightClasses.filter(i => i.isChecked).length}
          >
            <Text style={{
              ...styles.headerCancel,
              ...(!weightClasses.filter(i => i.isChecked).length && styles.disabledButton),
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
                label={`${item.name} — ${item._id === 10 ? t('WeightClassSelectModal.over') : ''}${item.weight} lbs`}
                value={item.isChecked}
                onChangeValue={() => {
                  if (weightClasses.filter(c => c.isChecked).length < 3 || item.isChecked) {
                    setWeightClasses(cs => cs.map(c => (
                      c._id === item._id ? { ...c, isChecked: !c.isChecked } : c
                    )));
                  }
                }}
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
