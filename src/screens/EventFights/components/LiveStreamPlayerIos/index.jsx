import React, { useEffect, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import * as eventApi from 'resources/event/event.api';

import Video from 'components/Video';

import styles from './styles';

const LiveStreamPlayerIos = React.forwardRef(({ eventId, muted, onReadyToPlay, onExitFullScreen }, ref) => {
  const [key, setKey] = useState(1);
  const [eventStreamLink, setEventStreamLink] = useState(null);
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);

  const getStreamLink = useCallback(async ({ refresh } = {}) => {
    if (!eventStreamLink || refresh) {
      const { link, width: streamWidth, height: streamHeight } = await eventApi.getStreamLinkByEventId(eventId);

      setEventStreamLink(link);
      setWidth(streamWidth);
      setHeight(streamHeight);
    }
  }, [eventStreamLink, eventId]);

  const onVideoError = useCallback(() => {
    getStreamLink({ refresh: true });
    setKey(k => k + 1);
  }, [getStreamLink]);

  useEffect(() => {
    getStreamLink();
  }, [getStreamLink]);

  const videoSource = useMemo(() => ({ uri: eventStreamLink }), [eventStreamLink]);

  return (
    <View style={styles.videoContainer} key={key}>
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
        onReadyToPlay={onReadyToPlay}
        onError={onVideoError}
      />
    </View>
  );
});

LiveStreamPlayerIos.propTypes = {
  eventId: PropTypes.string.isRequired,
  muted: PropTypes.bool.isRequired,
  onReadyToPlay: PropTypes.func.isRequired,
  onExitFullScreen: PropTypes.func.isRequired,
};

export default React.memo(LiveStreamPlayerIos);
