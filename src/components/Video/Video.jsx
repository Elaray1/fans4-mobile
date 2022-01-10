import React, { useCallback, useRef, useState, useMemo, useEffect, useImperativeHandle } from 'react';
import { TouchableOpacity, Pressable, View, Text, Modal, Platform,
  PanResponder, useWindowDimensions } from 'react-native';
import PropTypes from 'prop-types';
import ReactNativeVideo from 'react-native-video';
import FastImage from 'react-native-fast-image';
import { useIsFocused } from '@react-navigation/native';

import moment from 'moment';

import PlayIcon from 'assets/icons/play';
import PauseIcon from 'assets/icons/pause';
import OpenVideoFullScreenIcon from 'assets/icons/openVideoFullScreen';
import CloseVideoFullScreenIcon from 'assets/icons/closeVideoFullScreen';

import useOrientation from './hooks/useOrientation';

import styles from './Video.styles';

const MAX_VERTICAL_VIDEO_ASPECT_RATIO = 4 / 5;
const CONTROLS_SHOWN_DURATION = 2 * 1000;
const PROGRESS_BAR_PADDING = 16;

const formatDuration = seconds => moment(moment.duration(seconds, 's').asMilliseconds()).format('mm:ss');

let keyCounter = 0;
const updateVideoKey = (value) => {
  keyCounter += 1;

  return `${value}-${keyCounter}`;
};

const Video = React.forwardRef(({ source, width, height, posterSource, duration, onReadyToPlay,
  viewable, onVideoStarted, playOnStart, isLive, onExitFullScreen, muted, pauseOnFullScreen,
}, ref) => {
  const isFocused = useIsFocused();

  const [key, setKey] = useState(undefined);
  const timeoutId = useRef();

  const [paused, setPaused] = useState(!playOnStart);
  const [renderingWidth, setRenderingWidth] = useState(0);
  const [playedTime, setPlayedTime] = useState(0);

  const [startLoadingDate, setStartLoadingDate] = useState(null);
  const [endLoadingDate, setEndLoadingDate] = useState(null);

  const [isControlsShown, setIsControlsShown] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPosterShown, setIsPosterShown] = useState(true);
  const [isRewinding, setIsRewinding] = useState(false);

  const playedTimeAsRef = useRef(0);
  const videoRef = useRef(null);
  const controlsShowingTimeout = useRef(null);
  const isVideoInEndedState = useRef(false);
  const isSeekedToLiveOnStart = useRef(false);

  const { width: windowWidth } = useWindowDimensions();
  const progressBarWidth = windowWidth - PROGRESS_BAR_PADDING;

  const onProgressBarPositionChanging = useCallback((event) => {
    clearTimeout(controlsShowingTimeout?.current);
    setIsRewinding(true);

    const locationXDuration = (event.nativeEvent.pageX) / progressBarWidth * duration;
    const isVideoEnded = locationXDuration >= duration;

    const newCurrectTime = isVideoEnded ? duration : locationXDuration;

    setPlayedTime(newCurrectTime);
  }, [duration, progressBarWidth]);

  const onProgressBarPositionChanged = useCallback((event) => {
    clearTimeout(controlsShowingTimeout?.current);
    setIsRewinding(false);

    const locationXDuration = (event.nativeEvent.pageX) / progressBarWidth * duration;
    const isVideoEnded = locationXDuration >= duration;

    const newCurrectTime = isVideoEnded ? duration : locationXDuration;

    setPlayedTime(newCurrectTime);
    playedTimeAsRef.current = newCurrectTime;

    isVideoInEndedState.current = isVideoEnded;

    videoRef.current.seek(newCurrectTime);
  }, [duration, progressBarWidth]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onShouldBlockNativeResponder: () => true,
    onPanResponderMove: (event) => {
      onProgressBarPositionChanging(event);
    },
    onPanResponderEnd: (event) => {
      onProgressBarPositionChanged(event);
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
    if (isRewinding) {
      return;
    }

    if (!endLoadingDate && playableDuration > 0) {
      setEndLoadingDate(moment().toDate());
    }

    setPlayedTime(currentTime);
    playedTimeAsRef.current = currentTime;

    if (isLive && !isSeekedToLiveOnStart.current) {
      isSeekedToLiveOnStart.current = true;
      videoRef.current.seek(seekableDuration);
    }
  }, [endLoadingDate, isLive, isRewinding]);

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
    videoRef.current.seek(playedTimeAsRef.current);
  }, [isFullScreen, pauseOnFullScreen]);

  const onFullscreenPlayerWillDismiss = useCallback(() => {
    if (pauseOnFullScreen) {
      pause();
    }

    if (onExitFullScreen) {
      onExitFullScreen();
    }
  }, [pause, pauseOnFullScreen, onExitFullScreen]);

  const onError = useCallback(() => {
    if (!timeoutId.current) {
      // Using setTimeout to decrease renders count
      const id = setTimeout(() => {
        timeoutId.current = null;
        setKey(updateVideoKey(source?.uri));
      }, 2000);
      timeoutId.current = id;
    }
  }, [source]);

  useEffect(() => {
    if (!paused && (!viewable || !isFocused) && !isFullScreen) {
      pause();
    }
  }, [viewable, pause, paused, isFocused, isFullScreen]);


  const renderingHeight = width / height < MAX_VERTICAL_VIDEO_ASPECT_RATIO
    ? renderingWidth * (1 / MAX_VERTICAL_VIDEO_ASPECT_RATIO)
    : renderingWidth / (width / height);

  const videoStyle = useMemo(() => ({
    width: renderingWidth,
    height: renderingHeight,
    borderRadius: 5,
  }), [renderingWidth, renderingHeight]);

  const posterStyle = useMemo(() => [videoStyle, viewable && styles.posterOverVideo], [viewable, videoStyle]);

  useOrientation({ isFullScreen });

  const Container = isFullScreen ? Modal : View;

  const progressBarContainerWidthStyle = useMemo(() => ({ width: progressBarWidth }), [progressBarWidth]);

  const progressBarWidthStyle = useMemo(() => ({
    // 10 pixes is needed to adjust seeking anchor position
    width: Math.max((playedTime / duration) * progressBarWidth, 10),
  }), [playedTime, duration, progressBarWidth]);

  const androidModalProps = useMemo(() => ({
    onRequestClose: toggleFullScreen,
    statusBarTranslucent: true,
  }), [toggleFullScreen]);

  return (
    <>
      <Container
        visible
        style={!isFullScreen && styles.container}
        {...Platform.OS === 'android' && androidModalProps}
      >
        <View
          style={isFullScreen ? styles.fullScreenContainer : styles.container}
          onLayout={handleRenderedContainerLayout}
        >
          {(!posterSource || !isPosterShown || viewable) && (
          <ReactNativeVideo
            key={key}
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
            onError={onError}
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
                style={[styles.progressBarContainer, progressBarContainerWidthStyle]}
                {...panResponder.panHandlers}
                hitSlop={{ top: 15, bottom: 15, left: 0, right: 0 }}
              >
                <View style={[styles.progressBar, progressBarWidthStyle]}>
                  <View style={styles.progressBarCircleWrapper}>
                    <View style={styles.progressBarCircle} />
                  </View>
                </View>
              </View>
              )}
            </>
          )}

          {!isControlsShown && <Pressable style={styles.toggleControlsShowingContainer} onPress={showControls} />}
        </View>
      </Container>
    </>
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
