import React, { useEffect, useState, useMemo, useCallback, useImperativeHandle, useRef } from 'react';
import { AppState, View } from 'react-native';
import PropTypes from 'prop-types';

import * as eventApi from 'resources/event/event.api';

import Video from 'components/Video';

import styles from './styles';

const LiveStreamPlayerIos = React.forwardRef(({
  eventId,
  onReadyToPlay,
  onExitFullScreen,
  onFullscreenOpened,
  isLiveStream,
}, ref) => {
  const [eventStreamLink, setEventStreamLink] = useState(null);
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);

  const [isPaused, setIsPaused] = useState(false);
  const [isLiveStreamShownIos, setIsLiveStreamShownIos] = useState(false);

  const videoRef = useRef();

  const getStreamLink = useCallback(async () => {
    if (!eventStreamLink && isLiveStream) {
      const { link, width: streamWidth, height: streamHeight } = await eventApi.getStreamLinkByEventId(eventId);

      setEventStreamLink(link);
      setWidth(streamWidth);
      setHeight(streamHeight);
    }
  }, [eventStreamLink, eventId, isLiveStream]);

  useImperativeHandle(ref, () => ({
    closeFullScreen: () => {
      videoRef.current.closeFullScreen();
    },
    showFullScreen: () => {
      videoRef.current.showFullScreen();
    },
    reload: () => {
      getStreamLink();
    },
  }));

  const onExitFullScreenIos = useCallback(() => {
    setIsLiveStreamShownIos(false);

    if (onExitFullScreen) {
      onExitFullScreen();
    }
  }, [onExitFullScreen]);

  const onFullscreenOpenedIos = useCallback(() => {
    setIsLiveStreamShownIos(true);

    if (onFullscreenOpened) {
      onFullscreenOpened();
    }
  }, [onFullscreenOpened]);

  useEffect(() => {
    AppState.addEventListener('change', (state) => {
      if (state !== 'active') {
        setIsPaused(true);
        return;
      }
      setIsPaused(false);
    });
  }, []);

  useEffect(() => {
    getStreamLink();
  }, [getStreamLink]);

  const videoSource = useMemo(() => ({ uri: eventStreamLink }), [eventStreamLink]);

  return (
    <View style={styles.videoContainer}>
      <Video
        ref={videoRef}
        isLive
        viewable
        playOnStart
        width={width}
        height={height}
        source={videoSource}
        muted={!isLiveStreamShownIos}
        onExitFullScreen={onExitFullScreenIos}
        pauseOnFullScreen={false}
        isPaused={isPaused}
        onReadyToPlay={onReadyToPlay}
        onFullscreenPlayerDidPresent={onFullscreenOpenedIos}
      />
    </View>
  );
});

LiveStreamPlayerIos.propTypes = {
  eventId: PropTypes.string.isRequired,
  onReadyToPlay: PropTypes.func.isRequired,
  onExitFullScreen: PropTypes.func,
  onFullscreenOpened: PropTypes.bool,
  isLiveStream: PropTypes.bool.isRequired,
};

LiveStreamPlayerIos.defaultProps = {
  onExitFullScreen: undefined,
  onFullscreenOpened: undefined,
};

export default React.memo(LiveStreamPlayerIos);
