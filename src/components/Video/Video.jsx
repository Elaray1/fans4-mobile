import React, { useCallback, useRef, useState, useMemo } from 'react';
import { TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import PropTypes from 'prop-types';
import ReactNativeVideo from 'react-native-video';

import PlayIcon from 'assets/icons/play';

import styles from './Video.styles';

const MAX_VERTICAL_VIDEO_ASPECT_RATIO = 4 / 5;

function Video({ source, width, height }) {
  const [paused, setPaused] = useState(true);
  const play = useCallback(() => setPaused(false), []);
  const pause = useCallback(() => setPaused(true), []);
  const [renderingWidth, setRenderingWidth] = useState(1);
  const videoRef = useRef(null);

  const handleRenderedContainerLayout = useCallback((evt) => {
    if (renderingWidth === 1) {
      evt.persist();
      setRenderingWidth(evt.nativeEvent.layout.width);
    }
  }, [renderingWidth]);

  const seekToMakeThumbnail = useCallback(() => {
    videoRef.current.seek(0.2); // this is needed to make one of first frames to be thumbnail
  }, []);

  const renderingHeight = width / height < MAX_VERTICAL_VIDEO_ASPECT_RATIO
    ? width * (1 / MAX_VERTICAL_VIDEO_ASPECT_RATIO)
    : renderingWidth / (width / height);

  const videoStyle = useMemo(() => ({
    width: renderingWidth,
    height: renderingHeight,
    aspectRatio: renderingWidth / renderingHeight,
  }), [renderingWidth, renderingHeight]);

  return (
    <View style={styles.container} onLayout={handleRenderedContainerLayout}>
      <ReactNativeVideo
        ref={videoRef}
        onLoad={seekToMakeThumbnail}
        style={videoStyle}
        source={source}
        ignoreSilentSwitch="ignore"
        volume={1}
        playInBackground
        playWhenInactive
        paused={paused}
        resizeMode="cover"
      />

      <TouchableWithoutFeedback onPress={paused ? null : pause}>
        <View style={styles.pauseControlContainer}>
          {paused && (
            <TouchableOpacity onPress={play} activeOpacity={0.7}>
              <PlayIcon />
            </TouchableOpacity>
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

Video.propTypes = {
  source: PropTypes.shape({
    uri: PropTypes.string.isRequired,
    headers: PropTypes.shape({}),
  }).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default React.memo(Video);
