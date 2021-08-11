import React, { useCallback, useRef, useState, useMemo } from 'react';
import { TouchableOpacity, Pressable, View, Text, Modal, Platform } from 'react-native';
import PropTypes from 'prop-types';
import ReactNativeVideo from 'react-native-video';
import FastImage from 'react-native-fast-image';
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

function Video({ source, width, height, posterSource, duration, viewable }) {
  const [paused, setPaused] = useState(true);
  const [renderingWidth, setRenderingWidth] = useState(0);
  const [playedTime, setPlayedTime] = useState(0);
  const playedTimeAsRef = useRef(0);

  const [isControlsShown, setIsControlsShown] = useState(true);
  const videoRef = useRef(null);
  const controlsShowingTimeout = useRef(null);
  const isVideoInEndedState = useRef(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPosterShown, setIsPosterShown] = useState(true);

  const hideControlsWithTimeout = useCallback(() => {
    clearTimeout(controlsShowingTimeout?.current);
    controlsShowingTimeout.current = setTimeout(() => {
      setIsControlsShown(false);
    }, CONTROLS_SHOWN_DURATION);
  }, []);

  const play = useCallback(() => {
    if (isVideoInEndedState.current) {
      setPlayedTime(0);
      isVideoInEndedState.current = false;
      videoRef.current.seek(0);
    }

    if (isPosterShown) {
      setIsPosterShown(false);
    }

    setPaused(false);
    setPaused(true);
    setPaused(false);

    hideControlsWithTimeout();
  }, [hideControlsWithTimeout, isPosterShown]);

  const pause = useCallback(() => {
    setPaused(true);
    hideControlsWithTimeout();
  }, [hideControlsWithTimeout]);

  const onFullscreenPlayerDidDismiss = useCallback(() => {
    setPaused(true);
    setIsControlsShown(true);
  }, []);

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
    seekToMakeThumbnail(videoDuration);
  }, [seekToMakeThumbnail]);

  const updateTiming = useCallback(({ currentTime }) => {
    setPlayedTime(currentTime);
    playedTimeAsRef.current = currentTime;
  }, []);

  const toggleFullScreen = useCallback(() => {
    if (setIsPosterShown) {
      setIsPosterShown(false);
    }

    if (isFullScreen) {
      setPaused(true);
      clearTimeout(controlsShowingTimeout?.current);
    }

    setIsFullScreen(!isFullScreen);
    setPlayedTime(playedTimeAsRef.current);
  }, [isFullScreen]);

  useDidUpdate(() => {
    setPlayedTime(playedTimeAsRef.current);

    if (videoRef.current) {
      videoRef.current.seek(playedTimeAsRef.current);
    }
  }, [isFullScreen]);

  const showFullScreen = useCallback(() => {
    videoRef.current.presentFullscreenPlayer();
  }, []);

  const renderingHeight = width / height < MAX_VERTICAL_VIDEO_ASPECT_RATIO
    ? renderingWidth * (1 / MAX_VERTICAL_VIDEO_ASPECT_RATIO)
    : renderingWidth / (width / height);

  const videoStyle = useMemo(() => ({
    width: renderingWidth,
    height: renderingHeight,
  }), [renderingWidth, renderingHeight]);

  const posterStyle = useMemo(() => [videoStyle, viewable && styles.posterOverVideo], [viewable, videoStyle]);

  const Container = isFullScreen ? Modal : View;

  return (
    <Container visible style={!isFullScreen && styles.container}>
      <View
        style={isFullScreen ? styles.fullScreenContainer : styles.container}
        onLayout={handleRenderedContainerLayout}
      >
        {(!posterSource || !isPosterShown || viewable) && (
          <ReactNativeVideo
            onFullscreenPlayerDidDismiss={onFullscreenPlayerDidDismiss}
            onLoad={handleOnLoadEvent}
            ref={videoRef}
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
        )}

        {posterSource && isPosterShown && (
          <FastImage style={posterStyle} source={posterSource} />
        )}

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
              <TouchableOpacity onPress={Platform.OS === 'ios' ? showFullScreen : toggleFullScreen}>
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
  posterSource: PropTypes.object,
  source: PropTypes.shape({
    uri: PropTypes.string.isRequired,
    headers: PropTypes.shape({}),
  }).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  duration: PropTypes.number,
  viewable: PropTypes.bool,
};

Video.defaultProps = {
  posterSource: null,
  duration: 0,
  viewable: false,
};

export default React.memo(Video);
