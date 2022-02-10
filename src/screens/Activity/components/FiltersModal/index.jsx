import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  View, TouchableOpacity, Modal, Pressable,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import _ from 'lodash';

import SelectedFilterIcon from 'assets/icons/selected-filter';

import * as userSelectors from 'resources/user/user.selectors';

import Text from 'components/Text';

import { ACTIVITY_TYPES } from 'resources/activity/activity.constants';
import { USER_TYPES } from 'resources/user/user.constants';

import styles from './styles';

function FiltersModal({
  onClose,
  visible,
  selectedFilters,
  setSelectedFilters,
}) {
  const { t } = useTranslation();

  const userType = useSelector(userSelectors.getUserType);

  const isFighter = userType === USER_TYPES.FIGHTER;

  const filters = useMemo(() => [
    {
      title: t('FiltersModal.allActivity'),
      types: Object.values(ACTIVITY_TYPES),
    },
    {
      title: t('FiltersModal.likes'),
      types: [ACTIVITY_TYPES.NEW_POST_LIKE, ACTIVITY_TYPES.NEW_COMMENT_LIKE],
    },
    {
      title: t('FiltersModal.commentsAndReplies'),
      types: [ACTIVITY_TYPES.NEW_POST_COMMENT, ACTIVITY_TYPES.NEW_REPLY],
    },
  ], [t]);

  if (isFighter) {
    filters.push({
      title: t('FiltersModal.newFans'),
      types: [ACTIVITY_TYPES.NEW_FAN],
    });
  }

  const onCloseModal = useCallback(() => {
    onClose(selectedFilters);
  }, [selectedFilters, onClose]);

  const onSelectFilter = useCallback((types) => {
    setSelectedFilters(types);
    onCloseModal();
  }, [onCloseModal, setSelectedFilters]);

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
              {selectedFilters.length === Object.values(ACTIVITY_TYPES).length
                ? title === t('FiltersModal.allActivity') && <SelectedFilterIcon />
                : _.difference(types, selectedFilters).length === 0 && <SelectedFilterIcon />}
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
  setSelectedFilters: PropTypes.func.isRequired,
};

export default React.memo(FiltersModal);
