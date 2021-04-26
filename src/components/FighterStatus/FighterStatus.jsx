import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import Text from 'components/Text';

import { FIGHTER_STATUSES } from './FighterStatus.constants';
import styles from './FighterStatus.style';

function FighterStatus({ status }) {
  const { t } = useTranslation();

  return (
    <View style={styles.statusWrapper}>
      <View style={[styles.statusContainer, styles[`${status}Container`]]}>
        <Text style={[styles.statusText, styles[`${status}Text`]]}>
          {t(`FighterStatus.${status}`)}
        </Text>
      </View>
    </View>
  );
}

FighterStatus.propTypes = {
  status: PropTypes.oneOf(Object.values(FIGHTER_STATUSES)).isRequired,
};

export default React.memo(FighterStatus);
