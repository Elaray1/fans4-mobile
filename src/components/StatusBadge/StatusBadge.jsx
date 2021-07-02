import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import Text from 'components/Text';

import { POST_STATUSES } from 'resources/post/post.constants';
import { USER_STATUSES } from 'resources/user/user.constants';

import { FIGHTER_STATUSES } from './StatusBadge.constants';

import styles from './StatusBadge.styles';

function StatusBadge({ status }) {
  const { t } = useTranslation();

  const isPost = Object.values(POST_STATUSES).includes(status);

  return (
    <View style={styles.statusWrapper}>
      <View style={[styles.statusContainer, styles[`${status}Container`], isPost && styles.statusPostContainer]}>
        <Text style={[styles.statusText, styles[`${status}Text`]]}>
          {t(`StatusBadge.${status}`)}
        </Text>
      </View>
    </View>
  );
}

StatusBadge.propTypes = {
  status: PropTypes.oneOf([
    ...Object.values(FIGHTER_STATUSES),
    ...Object.values(POST_STATUSES),
    ...Object.values(USER_STATUSES),
  ]).isRequired,
};

export default React.memo(StatusBadge);
