import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import * as eventApi from 'resources/event/event.api';

import Video from 'components/Video';

import styles from './styles';

const LiveStreamPlayerIos = React.forwardRef(({ eventId, muted, onReadyToPlay, onExitFullScreen }, ref) => {
  const [eventStreamLink, setEventStreamLink] = useState(null);
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);

  useEffect(() => {
    const getStreamLink = async () => {
      if (!eventStreamLink) {
        const { link, width: streamWidth, height: streamHeight } = await eventApi.getStreamLinkByEventId(eventId);

        setEventStreamLink(link);
        setWidth(streamWidth);
        setHeight(streamHeight);
      }
    };

    getStreamLink();
  }, [eventStreamLink, eventId]);

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
        onReadyToPlay={onReadyToPlay}
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
