import React, { useMemo, useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';

import LiveIcon from 'assets/icons/live.svg';

import Text from 'components/Text';

import styles from './styles';

const WatchLiveStreamBanner = ({ event, onPress }) => {
  const { t } = useTranslation();

  const posterSource = useMemo(() => {
    return { uri: event.imageUrl };
  }, [event.imageUrl]);

  const onContainerPress = useCallback(() => {
    onPress(event);
  }, [onPress, event]);

  return (
    <TouchableOpacity onPress={onContainerPress} style={styles.container}>
      <View>
        <FastImage style={styles.poster} source={posterSource} />

        <View style={styles.live}>
          <LiveIcon />
          <Text>{t('WatchLiveStreamBanner.live')}</Text>
        </View>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.isLiveText}>{event.name} {t('WatchLiveStreamBanner.isLive')}</Text>
        <Text style={styles.watchLiveText}>{t('WatchLiveStreamBanner.watchLive')}</Text>
      </View>
    </TouchableOpacity>
  );
};

WatchLiveStreamBanner.propTypes = {
  event: PropTypes.shape().isRequired,
  onPress: PropTypes.func.isRequired,
};

export default React.memo(WatchLiveStreamBanner);
