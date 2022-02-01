import React, { useState, useMemo, useEffect, useImperativeHandle, useRef, useCallback } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import Video from 'components/Video';

import * as eventApi from 'resources/event/event.api';

import styles from './styles';

const FinishedStreamVideo = React.forwardRef(({ eventId, width, height, duration, onReadyToPlay }, ref) => {
  const [eventStreamLink, setEventStreamLink] = useState(null);
  const videoRef = useRef(null);

  const _onReadyToPlay = useCallback(() => {
    if (onReadyToPlay) {
      onReadyToPlay();
    }
  }, [onReadyToPlay]);

  useEffect(() => {
    const loadLink = async () => {
      const { link } = await eventApi.getStreamLinkByEventId(eventId);
      setEventStreamLink(link);
    };

    loadLink();
  }, [eventId]);

  useImperativeHandle(ref, () => ({
    closeFullScreen: () => {
      videoRef.current?.closeFullScreen();
      videoRef.current?.pause();
    },
    showFullScreen: () => {
      videoRef.current?.showFullScreen();
      videoRef.current?.play();
    },
  }));

  const videoSource = useMemo(() => {
    if (!eventStreamLink) {
      return null;
    }

    return { uri: eventStreamLink };
  }, [eventStreamLink]);

  return (
    <View style={styles.finishedVideoContainer}>
      {eventStreamLink && (
        <Video
          ref={videoRef}
          viewable
          source={videoSource}
          width={width}
          height={height}
          duration={duration}
          onReadyToPlay={_onReadyToPlay}
        />
      )}
    </View>
  );
});

FinishedStreamVideo.propTypes = {
  eventId: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  onReadyToPlay: PropTypes.func,
};

FinishedStreamVideo.defaultProps = {
  onReadyToPlay: undefined,
};

export default React.memo(FinishedStreamVideo);
