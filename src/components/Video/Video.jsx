import React, { useCallback, useMemo, useState } from 'react';
import { TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import PropTypes from 'prop-types';
import ReactNativeVideo from 'react-native-video';

import PlayIcon from 'assets/icons/play';

import styles from './Video.styles';

function Video({ uri, aspectRatio }) {
  const [paused, setPaused] = useState(true);
  const play = useCallback(() => setPaused(false), []);
  const pause = useCallback(() => setPaused(true), []);

  return (
    <View style={styles.container}>
      <ReactNativeVideo
        style={[styles.video, { aspectRatio }]}
        source={{ uri }}
        ignoreSilentSwitch="ignore"
        volume={1}
        playInBackground
        playWhenInactive
        paused={paused}
        resizeMode="contain"
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
  uri: PropTypes.string.isRequired,
  aspectRatio: PropTypes.number.isRequired,
};

export default React.memo(Video);
