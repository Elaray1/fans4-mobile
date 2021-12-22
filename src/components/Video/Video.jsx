import React, { useCallback, useRef, useState, useMemo, useEffect, useImperativeHandle } from 'react';
import { TouchableOpacity, Pressable, View, Text, Modal, Platform, Dimensions, PanResponder } from 'react-native';
import PropTypes from 'prop-types';
import ReactNativeVideo from 'react-native-video';
import FastImage from 'react-native-fast-image';
import { useIsFocused } from '@react-navigation/native';

import moment from 'moment';

import PlayIcon from 'assets/icons/play';
import PauseIcon from 'assets/icons/pause';
import OpenVideoFullScreenIcon from 'assets/icons/openVideoFullScreen';
import CloseVideoFullScreenIcon from 'assets/icons/closeVideoFullScreen';

import useDidUpdate from 'hooks/useDidUpdate';

import { variables } from 'themes/commonStyles';

import styles from './Video.styles';

const MAX_VERTICAL_VIDEO_ASPECT_RATIO = 4 / 5;
const CONTROLS_SHOWN_DURATION = 2 * 1000;

const { width: windowWidth } = Dimensions.get('window');

const progressBarWidth = windowWidth - variables.paddingHorizontal;

const formatDuration = seconds => moment(moment.duration(seconds, 's').asMilliseconds()).format('mm:ss');

const Video = React.forwardRef(({ source, width, height, posterSource, duration, onReadyToPlay,
  viewable, onVideoStarted, playOnStart, isLive, onExitFullScreen, muted, pauseOnFullScreen,
}, ref) => {
  const isFocused = useIsFocused();

  const [paused, setPaused] = useState(!playOnStart);
  const [renderingWidth, setRenderingWidth] = useState(0);
  const [playedTime, setPlayedTime] = useState(0);

  const [startLoadingDate, setStartLoadingDate] = useState(null);
  const [endLoadingDate, setEndLoadingDate] = useState(null);

  const [isControlsShown, setIsControlsShown] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPosterShown, setIsPosterShown] = useState(true);

  const playedTimeAsRef = useRef(0);
  const videoRef = useRef(null);
  const controlsShowingTimeout = useRef(null);
  const isVideoInEndedState = useRef(false);
  const isSeekedToLiveOnStart = useRef(false);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event) => {
      clearTimeout(controlsShowingTimeout?.current);

      const newCurrectTime = (event.nativeEvent.locationX) / progressBarWidth * duration;
      setPlayedTime(newCurrectTime);
      playedTimeAsRef.current = newCurrectTime;
      videoRef.current.seek(newCurrectTime);
    },
  });

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

  useImperativeHandle(ref, () => ({
    showFullScreen: () => {
      videoRef.current.presentFullscreenPlayer();
    },
  }));

  useEffect(() => {
    if (startLoadingDate && endLoadingDate && onVideoStarted && !paused) {
      onVideoStarted({ startLoadingDate, endLoadingDate });
      setStartLoadingDate(null);
      setEndLoadingDate(null);
    }
  }, [startLoadingDate, endLoadingDate, onVideoStarted, paused]);

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

  const handleOnLoadStartEvent = useCallback(() => {
    setStartLoadingDate(moment().toDate());
  }, []);

  const showFullScreen = useCallback(() => {
    videoRef.current.presentFullscreenPlayer();
  }, []);

  const handleOnLoadEvent = useCallback(({ duration: videoDuration, currentPosition }) => {
    seekToMakeThumbnail(videoDuration);

    if (onReadyToPlay) {
      onReadyToPlay();
    }
  }, [seekToMakeThumbnail, onReadyToPlay]);

  const updateTiming = useCallback(({ currentTime, playableDuration, seekableDuration }) => {
    if (!endLoadingDate && playableDuration > 0) {
      setEndLoadingDate(moment().toDate());
    }

    setPlayedTime(currentTime);
    playedTimeAsRef.current = currentTime;

    if (isLive && !isSeekedToLiveOnStart.current) {
      isSeekedToLiveOnStart.current = true;
      videoRef.current.seek(seekableDuration);
    }
  }, [endLoadingDate, isLive]);

  const toggleFullScreen = useCallback(() => {
    if (setIsPosterShown) {
      setIsPosterShown(false);
    }

    if (isFullScreen) {
      if (pauseOnFullScreen) {
        setPaused(true);
      }

      clearTimeout(controlsShowingTimeout?.current);
    }

    setIsFullScreen(!isFullScreen);
    setPlayedTime(playedTimeAsRef.current);
  }, [isFullScreen, pauseOnFullScreen]);

  const onFullscreenPlayerWillDismiss = useCallback(() => {
    if (pauseOnFullScreen) {
      pause();
    }

    if (onExitFullScreen) {
      onExitFullScreen();
    }
  }, [pause, pauseOnFullScreen, onExitFullScreen]);

  useDidUpdate(() => {
    setPlayedTime(playedTimeAsRef.current);

    if (videoRef.current) {
      videoRef.current.seek(playedTimeAsRef.current);
    }
  }, [isFullScreen]);

  useEffect(() => {
    if (!paused && (!viewable || !isFocused)) {
      pause();
    }
  }, [viewable, pause, paused, isFocused]);


  const renderingHeight = width / height < MAX_VERTICAL_VIDEO_ASPECT_RATIO
    ? renderingWidth * (1 / MAX_VERTICAL_VIDEO_ASPECT_RATIO)
    : renderingWidth / (width / height);

  const videoStyle = useMemo(() => ({
    width: renderingWidth,
    height: renderingHeight,
    borderRadius: 5,
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
            muted={muted}
            onFullscreenPlayerWillDismiss={onFullscreenPlayerWillDismiss}
            onLoadStart={handleOnLoadStartEvent}
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

            <View style={[styles.timingContainer, isFullScreen && styles.fullScreenTimingContainer]}>
              <Text style={[styles.timingText, styles.playedTimeText]}>{formatDuration(playedTime)}</Text>
              <Text style={[styles.timingText, styles.durationText]}> / {formatDuration(duration)}</Text>
            </View>

            <View style={[styles.toggleFullScreenIconContainer, isFullScreen && styles.fullScreenIconContainer]}>
              <TouchableOpacity onPress={Platform.OS === 'ios' ? showFullScreen : toggleFullScreen}>
                {isFullScreen ? <CloseVideoFullScreenIcon /> : <OpenVideoFullScreenIcon />}
              </TouchableOpacity>
            </View>

            {isFullScreen && (
            <View
              style={styles.progressBarContainer}
              {...panResponder.panHandlers}
            >
              <View style={[styles.progressBar, { width: `${playedTime / duration * 100}%` }]} />
            </View>
            )}
          </>
        )}

        {!isControlsShown && <Pressable style={styles.toggleControlsShowingContainer} onPress={showControls} />}
      </View>
    </Container>
  );
});

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
  onVideoStarted: PropTypes.func,
  playOnStart: PropTypes.bool,
  isLive: PropTypes.bool,
  muted: PropTypes.bool,
  onExitFullScreen: PropTypes.func,
  pauseOnFullScreen: PropTypes.bool,
  onReadyToPlay: PropTypes.func,
};

Video.defaultProps = {
  posterSource: null,
  duration: 0,
  viewable: false,
  onVideoStarted: null,
  playOnStart: false,
  isLive: false,
  onExitFullScreen: undefined,
  muted: false,
  pauseOnFullScreen: true,
  onReadyToPlay: undefined,
};

export default React.memo(Video);
