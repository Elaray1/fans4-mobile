import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  View, TouchableOpacity, Modal, Pressable,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';

import SelectedFilterIcon from 'assets/icons/selected-filter';

import Text from 'components/Text';

import { ACTIVITY_TYPES } from 'resources/activity/activity.constants';

import styles from './styles';

function FiltersModal({
  onClose,
  visible,
  selectedFilters,
}) {
  const { t } = useTranslation();
  const [selectedActionTypes, setSelectedActionTypes] = useState(selectedFilters);

  const onSelectFilter = useCallback((types) => {
    setSelectedActionTypes(types);
  }, []);

  const filters = useMemo(() => [
    {
      title: t('FiltersModal.allActivity'),
      types: Object.values(ACTIVITY_TYPES),
    },
    {
      title: t('FiltersModal.likes'),
      types: [ACTIVITY_TYPES.NEW_POST_LIKE],
    },
    {
      title: t('FiltersModal.commentsAndReplies'),
      types: [ACTIVITY_TYPES.NEW_POST_COMMENT],
    },
    {
      title: t('FiltersModal.newFans'),
      types: [ACTIVITY_TYPES.NEW_FAN],
    },
  ], [t]);

  const onCloseModal = useCallback(() => {
    onClose(selectedActionTypes);
  }, [selectedActionTypes, onClose]);

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onCloseModal}
    >
      <View style={styles.modal}>
        {filters.map(({ title, types }, index) => (
          <View
            key={title}
          >
            <TouchableOpacity
              onPress={() => onSelectFilter(types)}
              activeOpacity={0.7}
              style={styles.filter}
            >
              <Text style={styles.title}>{title}</Text>
              {selectedActionTypes.length === Object.values(ACTIVITY_TYPES).length
                ? title === t('FiltersModal.allActivity') && <SelectedFilterIcon />
                : _.difference(types, selectedActionTypes).length === 0 && <SelectedFilterIcon />}
            </TouchableOpacity>
            {index < filters.length - 1 && <View style={styles.line} />}
          </View>
        ))}
      </View>
      <Pressable style={styles.background} onPress={onCloseModal} />
    </Modal>
  );
}

FiltersModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  selectedFilters: PropTypes.arrayOf(PropTypes.oneOf(Object.values(ACTIVITY_TYPES))).isRequired,
};

export default React.memo(FiltersModal);
