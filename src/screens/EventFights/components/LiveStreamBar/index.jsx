import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import Text from 'components/Text';

import LiveIcon from 'assets/icons/live.svg';

import styles from './styles';

const LiveStreamBar = ({ fightsWithResultsCount, fightsCount }) => {
  const { t } = useTranslation();

  const progress = `${(fightsWithResultsCount) / fightsCount * 100}%`;

  return (
    <View>
      <View style={styles.live}>
        <LiveIcon />
        <Text>{t('Events.live')}</Text>
      </View>

      <View style={styles.line}>
        <View style={[styles.progress, { width: progress }]} />
      </View>
    </View>
  );
};

LiveStreamBar.propTypes = {
  fightsWithResultsCount: PropTypes.number.isRequired,
  fightsCount: PropTypes.number.isRequired,
};

export default React.memo(LiveStreamBar);
