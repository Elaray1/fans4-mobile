import React, { useCallback, useRef, useState, useMemo } from 'react';
import { TouchableOpacity, Pressable, View, Text, Modal } from 'react-native';
import PropTypes from 'prop-types';
import ReactNativeVideo from 'react-native-video';
// import convertToProxyURL from 'react-native-video-cache';
import moment from 'moment';

import PlayIcon from 'assets/icons/play';
import PauseIcon from 'assets/icons/pause';
import OpenVideoFullScreenIcon from 'assets/icons/openVideoFullScreen';
import CloseVideoFullScreenIcon from 'assets/icons/closeVideoFullScreen';

import useDidUpdate from 'hooks/useDidUpdate';

import styles from './Video.styles';

const MAX_VERTICAL_VIDEO_ASPECT_RATIO = 4 / 5;
const CONTROLS_SHOWN_DURATION = 2 * 1000;

const formatDuration = seconds => moment(moment.duration(seconds, 's').asMilliseconds()).format('mm:ss');

function Video({ source, width, height }) {
  const [paused, setPaused] = useState(true);
  const [renderingWidth, setRenderingWidth] = useState(1);
  const [playedTime, setPlayedTime] = useState(0);
  const playedTimeAsRef = useRef(0);

  const [duration, setDuration] = useState(0);
  const [isControlsShown, setIsControlsShown] = useState(true);
  const videoRef = useRef(null);
  const controlsShowingTimeout = useRef(null);
  const isVideoInEndedState = useRef(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const hideControlsWithTimeout = useCallback(() => {
    clearTimeout(controlsShowingTimeout?.current);
    controlsShowingTimeout.current = setTimeout(() => {
      setIsControlsShown(false);
    }, CONTROLS_SHOWN_DURATION);
  }, []);

  const play = useCallback(() => {
    if (isVideoInEndedState.current) {
      isVideoInEndedState.current = false;
      videoRef.current.seek(0);
    }

    setPaused(false);
    hideControlsWithTimeout();
  }, [hideControlsWithTimeout]);

  const pause = useCallback(() => {
    setPaused(true);
    hideControlsWithTimeout();
  }, [hideControlsWithTimeout]);

  const showControls = useCallback(() => {
    setIsControlsShown(true);
    hideControlsWithTimeout();
  }, [hideControlsWithTimeout]);

  const handleVideoPlayingEnded = useCallback(() => {
    clearTimeout(controlsShowingTimeout?.current);

    setIsControlsShown(true);
    setPaused(true);

    // this is needed to fix bug with ended video
    // Sometimes shown played time is 00:12 but actual duration is 00:13
    setPlayedTime(duration);
    playedTimeAsRef.current = duration;

    isVideoInEndedState.current = true;
  }, [setPlayedTime, duration]);

  const handleRenderedContainerLayout = useCallback((evt) => {
    setRenderingWidth(evt.nativeEvent.layout.width);
  }, []);

  const seekToMakeThumbnail = useCallback(() => {
    videoRef.current.seek(playedTime || 0.2); // this is needed to make one of first frames to be thumbnail
  }, [playedTime]);

  const handleOnLoadEvent = useCallback(({ duration: videoDuration }) => {
    setDuration(videoDuration);
    seekToMakeThumbnail(videoDuration);
  }, [seekToMakeThumbnail]);

  const updateTiming = useCallback(({ currentTime }) => {
    setPlayedTime(currentTime);
    playedTimeAsRef.current = currentTime;
  }, []);

  const toggleFullScreen = useCallback(() => {
    if (isFullScreen) {
      setPaused(true);
      clearTimeout(controlsShowingTimeout?.current);
    }

    setIsFullScreen(!isFullScreen);
    setPlayedTime(playedTimeAsRef.current);
  }, [isFullScreen]);

  useDidUpdate(() => {
    videoRef.current.seek(playedTimeAsRef.current);
  }, [isFullScreen]);

  const renderingHeight = width / height < MAX_VERTICAL_VIDEO_ASPECT_RATIO
    ? renderingWidth * (1 / MAX_VERTICAL_VIDEO_ASPECT_RATIO)
    : renderingWidth / (width / height);

  const videoStyle = useMemo(() => ({
    width: renderingWidth,
    height: renderingHeight,
  }), [renderingWidth, renderingHeight]);

  // const cachedSource = useMemo(() => {
  //   return { ...source, uri: convertToProxyURL(source.uri) };
  // }, [source]);

  const Container = isFullScreen ? Modal : View;

  return (
    <Container visible style={!isFullScreen && styles.container}>
      <View
        style={isFullScreen ? styles.fullScreenContainer : styles.container}
        onLayout={handleRenderedContainerLayout}
      >
        <ReactNativeVideo
          ref={videoRef}
          onLoad={handleOnLoadEvent}
          onEnd={handleVideoPlayingEnded}
          style={videoStyle}
          source={source}
          ignoreSilentSwitch="ignore"
          volume={1}
          playInBackground
          playWhenInactive
          paused={paused}
          resizeMode="cover"
          progressUpdateInterval={300}
          onProgress={updateTiming}
        />

        {isControlsShown && (
          <>
            {paused && (
              <View style={styles.playControlContainer}>
                <TouchableOpacity onPress={play} activeOpacity={0.7}>
                  <PlayIcon />
                </TouchableOpacity>
              </View>
            )}

            {!paused && (
              <View style={styles.playControlContainer}>
                <TouchableOpacity onPress={pause} activeOpacity={0.7}>
                  <PauseIcon />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.timingContainer}>
              <Text style={[styles.timingText, styles.playedTimeText]}>{formatDuration(playedTime)}</Text>
              <Text style={[styles.timingText, styles.durationText]}> / {formatDuration(duration)}</Text>
            </View>

            <View style={styles.toggleFullScreenIconContainer}>
              <TouchableOpacity onPress={toggleFullScreen}>
                {isFullScreen ? <CloseVideoFullScreenIcon /> : <OpenVideoFullScreenIcon />}
              </TouchableOpacity>
            </View>
          </>
        )}

        {!isControlsShown && <Pressable style={styles.toggleControlsShowingContainer} onPress={showControls} />}
      </View>
    </Container>

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
