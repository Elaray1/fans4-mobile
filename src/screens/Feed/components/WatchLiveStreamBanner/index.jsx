import React, { useMemo, useCallback, useState, useRef } from 'react';
import { TouchableOpacity, View, Platform, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';

import LiveIcon from 'assets/icons/live.svg';

import Text from 'components/Text';
import LiveStreamPlayerIos from 'components/LiveStreamPlayerIos';

import { LIVE_STREAM_STATUSES } from 'resources/event/event.constants';

import colors from 'themes/colors';

import styles from './styles';

const WatchLiveStreamBanner = ({ event, onPress }) => {
  const { t } = useTranslation();

  const isLiveStream = event.liveStream.status === LIVE_STREAM_STATUSES.LIVE;

  const posterSource = useMemo(() => {
    return { uri: event.imageUrl };
  }, [event.imageUrl]);

  const [isStreamLoading, setIsStreamLoading] = useState(true);
  const streamVideoRefIos = useRef();

  const onContainerPress = useCallback(() => {
    if (onPress) {
      onPress(event);
    }

    if (!isStreamLoading && Platform.OS === 'ios') {
      streamVideoRefIos.current.showFullScreen();
    }
  }, [onPress, event, isStreamLoading]);

  const onReadyToPlayIos = useCallback(() => {
    setIsStreamLoading(false);
  }, []);


  return (
    <TouchableOpacity onPress={onContainerPress} style={styles.container}>
      <View>
        {Platform.OS === 'ios' && (
          <LiveStreamPlayerIos
            ref={streamVideoRefIos}
            eventId={event._id}
            onReadyToPlay={onReadyToPlayIos}
            isLiveStream={isLiveStream}
          />
        )}

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

      {isStreamLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </TouchableOpacity>
  );
};

WatchLiveStreamBanner.propTypes = {
  event: PropTypes.shape().isRequired,
  onPress: PropTypes.func.isRequired,
};

export default React.memo(WatchLiveStreamBanner);
