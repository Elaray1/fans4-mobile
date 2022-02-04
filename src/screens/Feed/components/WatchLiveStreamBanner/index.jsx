import React, { useMemo, useCallback, useState, useRef } from 'react';
import { TouchableOpacity, View, Platform, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';

import LiveIcon from 'assets/icons/live.svg';

import Text from 'components/Text';
import LiveStreamPlayerIos from 'components/LiveStreamPlayerIos';

import useDidUpdate from 'hooks/useDidUpdate';

import { LIVE_STREAM_STATUSES } from 'resources/event/event.constants';

import colors from 'themes/colors';

import styles from './styles';

const WatchLiveStreamBanner = ({ event, onPress }) => {
  const { t } = useTranslation();

  const posterSource = useMemo(() => {
    return { uri: event.imageUrl };
  }, [event.imageUrl]);

  const [isStreamLoading, setIsStreamLoading] = useState(Platform.OS === 'ios');
  const streamVideoRefIos = useRef();

  const onContainerPress = useCallback(() => {
    if (onPress) {
      onPress(event);
    }

    if (!isStreamLoading && Platform.OS === 'ios') {
      streamVideoRefIos.current.showFullScreen();
    }
  }, [onPress, event, isStreamLoading]);

  const [wasWaitedForPreloadStream, setWasWaitedForPreloadStream] = useState(false);

  const onReadyToPlayIos = useCallback(() => {
    setIsStreamLoading(false);
    setWasWaitedForPreloadStream(true);
  }, []);

  const isLive = event.liveStream.status === LIVE_STREAM_STATUSES.LIVE;
  const isFullScreenOpenedIosRef = useRef(false);

  const onFullscreenOpenedIos = useCallback(() => {
    isFullScreenOpenedIosRef.current = true;
  }, []);

  const onExitFullScreenIos = useCallback(() => {
    isFullScreenOpenedIosRef.current = false;
  }, []);

  useDidUpdate(() => {
    if (!isFullScreenOpenedIosRef.current && isLive && Platform.OS === 'ios') {
      setIsStreamLoading(true);
      streamVideoRefIos.current.reload();
      setWasWaitedForPreloadStream(false);
    }
  }, [isLive]);

  return (
    <TouchableOpacity
      onPress={onContainerPress}
      style={isLive && wasWaitedForPreloadStream
        ? styles.container
        : styles.hiddenContainer}
    >
      <View>
        {Platform.OS === 'ios' && (
          <LiveStreamPlayerIos
            ref={streamVideoRefIos}
            eventId={event._id}
            onReadyToPlay={onReadyToPlayIos}
            eventLiveStreamStatus={event.liveStream.status}
            onExitFullScreen={onExitFullScreenIos}
            onFullscreenOpened={onFullscreenOpenedIos}
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
  onPress: PropTypes.func,
};

WatchLiveStreamBanner.defaultProps = {
  onPress: undefined,
};

export default React.memo(WatchLiveStreamBanner);
