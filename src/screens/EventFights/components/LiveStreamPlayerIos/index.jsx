import React, { useEffect, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import * as eventApi from 'resources/event/event.api';

import Video from 'components/Video';

import styles from './styles';

const LiveStreamPlayerIos = React.forwardRef(({
  eventId,
  muted,
  onReadyToPlay,
  onExitFullScreen,
  isPaused,
  onFullscreenOpened,
}, ref) => {
  const [eventStreamLink, setEventStreamLink] = useState(null);
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);

  const getStreamLink = useCallback(async () => {
    if (!eventStreamLink) {
      const { link, width: streamWidth, height: streamHeight } = await eventApi.getStreamLinkByEventId(eventId);

      setEventStreamLink(link);
      setWidth(streamWidth);
      setHeight(streamHeight);
    }
  }, [eventStreamLink, eventId]);

  useEffect(() => {
    getStreamLink();
  }, [getStreamLink]);

  const videoSource = useMemo(() => ({ uri: eventStreamLink }), [eventStreamLink]);

  return (
    <View style={styles.videoContainer}>
      <Video
        ref={ref}
        isLive
        viewable
        playOnStart
        width={width}
        height={height}
        source={videoSource}
        muted={muted}
        onExitFullScreen={onExitFullScreen}
        pauseOnFullScreen={false}
        isPaused={isPaused}
        onReadyToPlay={onReadyToPlay}
        onFullscreenPlayerDidPresent={onFullscreenOpened}
      />
    </View>
  );
});

LiveStreamPlayerIos.propTypes = {
  eventId: PropTypes.string.isRequired,
  muted: PropTypes.bool.isRequired,
  onReadyToPlay: PropTypes.func.isRequired,
  onExitFullScreen: PropTypes.func.isRequired,
  isPaused: PropTypes.bool.isRequired,
  onFullscreenOpened: PropTypes.bool.isRequired,
};

export default React.memo(LiveStreamPlayerIos);
