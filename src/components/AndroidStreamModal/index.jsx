import React, { useCallback, useState, useMemo, useImperativeHandle } from 'react';
import { View, ActivityIndicator, useWindowDimensions,
  TouchableOpacity, TouchableWithoutFeedback, Animated, StatusBar } from 'react-native';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';

import config from 'resources/config';

import CloseWithBackgroundIcon from 'assets/icons/close-with-background.svg';

import Header from 'components/Header';
import Text from 'components/Text';
import CountdownTimer from 'components/CountdownTimer';

import colors from 'themes/colors';

import { LIVE_STREAM_STATUSES } from 'resources/event/event.constants';
import * as eventApi from 'resources/event/event.api';

import useHorizontalModeHeader from './hooks/useHorizontaModeHeader';
import useOrientation from './hooks/useOrientation';
import useEventUpdating from './hooks/useEventUpdating';
import useUpdateWebviewOnConnectionChanged from './hooks/useUpdateWebviewOnConnectionChanged';
import useVisibilityChanged from './hooks/useVisibilityChanged';

import styles from './styles';
import useIsPaused from './hooks/useIsPaused';
import useGoLiveOnForeground from './hooks/useGoLiveOnForeground';

import EndedStreamView from './components/EndedStreamView';

const noLiveStreamStatuses = [
  LIVE_STREAM_STATUSES.PENDING,
  LIVE_STREAM_STATUSES.FINISHED,
  LIVE_STREAM_STATUSES.PROCESSING,
];

const finishedLiveStreamStatues = [
  LIVE_STREAM_STATUSES.FINISHED,
  LIVE_STREAM_STATUSES.PROCESSING,
];

const muteSound = (isMuted) => {
  return `
    document.querySelectorAll('video').forEach(video => {
      video.muted = ${isMuted};
    });
  `;
};

const EventLiveStreamAndroid = React.forwardRef(({
  eventId,
  eventName: initEventName,
  eventDate: initEventDate,
  eventTimezone: initEventTimezone,
  eventImageUrl: initEventImageUrl,
  eventLiveStreamStatus: initLiveStreamStatus,
  onClose,
}, ref) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [wasReadyToPlayback, setWasReadyToPlayback] = useState(false);

  const show = useCallback(() => setIsVisible(true), []);

  const hide = useCallback(() => {
    setIsVisible(false);

    if (onClose) {
      onClose();
    }
  }, [onClose]);

  const [eventName, setEventName] = useState(initEventName);
  const [eventDate, setEventDate] = useState(initEventDate);
  const [eventTimezone, setEventTimezone] = useState(initEventTimezone);
  const [eventImageUrl, setEventImageUrl] = useState(initEventImageUrl);
  const [liveStreamStatus, setLiveStreamStatus] = useState(initLiveStreamStatus);

  const updateEventData = useCallback((newEvent) => {
    setEventName(newEvent.name);
    setEventDate(newEvent.date);
    setEventTimezone(newEvent.location.timezone);
    setEventImageUrl(newEvent.imageUrl);
    setLiveStreamStatus(newEvent.liveStream.status);
  }, []);

  const [
    isEndedStreamViewShown,
    setIsEndedStreamViewShown,
  ] = useState(finishedLiveStreamStatues.includes(liveStreamStatus));

  const {
    webViewRef,
    streamLink,
    loadEvent,
  } = useEventUpdating({
    eventId,
    setIsLoading,
    setWasReadyToPlayback,
    updateEventData,
    liveStreamStatus,
    setIsEndedStreamViewShown,
  });

  const { prolongControlsShowing, isHorizontalModeHeaderShown } = useHorizontalModeHeader();
  const animation = useVisibilityChanged({ isVisible, webViewRef });

  const pause = useIsPaused({ webViewRef });

  useOrientation({ isVisible });
  useUpdateWebviewOnConnectionChanged({ webViewRef, isVisible, setIsLoading });
  useGoLiveOnForeground({ webViewRef });

  useImperativeHandle(ref, () => ({
    show,
    loadEvent,
  }));

  const { width, height } = useWindowDimensions();
  const isPortraitOrientation = height > width;

  const liveStreamSource = useMemo(() => (streamLink ? {
    uri: `${config.liveStreamPlayerUrl}/?link=${streamLink}`,
  } : null), [streamLink]);

  const checkAndHandleStreamEnd = useCallback(async (waitUntillPlaybackWillBeStopped) => {
    let isFinishedStream = noLiveStreamStatuses.includes(liveStreamStatus);

    if (!isFinishedStream) {
      try {
        const newEvent = await eventApi.getEvent(eventId);

        isFinishedStream = noLiveStreamStatuses.includes(newEvent.liveStream.status);
        updateEventData(newEvent);
      } catch (err) {
        console.error('event updating error:', err);
      }
    }

    if (isFinishedStream && (!isVisible || !waitUntillPlaybackWillBeStopped)) {
      pause();
      setIsEndedStreamViewShown(true);
    }
  }, [isVisible, eventId, liveStreamStatus, pause, updateEventData]);

  const onWebViewMessage = useCallback(async (msg) => {
    console.log('webview message:', msg.nativeEvent.data);

    if (msg.nativeEvent.data.includes('consoleError')) {
      setIsLoading(true);
      webViewRef.current.reload();

      return;
    }

    if (msg.nativeEvent.data === 'empty_stream_error') {
      if (!wasReadyToPlayback) {
        setIsLoading(true);
        webViewRef.current.reload();
        return;
      }

      checkAndHandleStreamEnd(true);
      return;
    }

    if (msg.nativeEvent.data === 'loaded_stream_part_was_watched') {
      checkAndHandleStreamEnd(false);
      return;
    }

    if (msg.nativeEvent.data === 'video_started') {
      prolongControlsShowing();
      setIsLoading(false);
      setWasReadyToPlayback(true);
      setIsEndedStreamViewShown(false);

      if (isVisible) {
        webViewRef.current.injectJavaScript(muteSound(false));
        return;
      }

      webViewRef.current.injectJavaScript(muteSound(true));
    }
  }, [prolongControlsShowing, isVisible, webViewRef, wasReadyToPlayback, checkAndHandleStreamEnd]);

  const onWebViewError = useCallback((err) => {
    console.log('webview error:', err);

    setIsLoading(true);
    setWasReadyToPlayback(false);

    webViewRef.current.reload();
  }, [webViewRef]);

  return (
    <Animated.View
      style={[styles.container, {
        transform: [{
          translateY: animation,
        }],
      }]}
    >
      {!isPortraitOrientation && isVisible && <StatusBar hidden />}

      {isPortraitOrientation && (
        <Header
          title={eventName}
          leftItemType="close"
          onLeftItemPress={hide}
        />
      )}

      <View style={styles.webViewContainer}>
        {streamLink && (
          <TouchableWithoutFeedback
            onPress={prolongControlsShowing}
            style={styles.webViewPressableContainer}
          >
            <WebView
              ref={webViewRef}
              scrollEnabled={false}
              nestedScrollEnabled={false}
              cacheEnabled={false}
              allowsFullscreenVideo
              style={styles.webView}
              onMessage={onWebViewMessage}
              source={liveStreamSource}
              mediaPlaybackRequiresUserAction={false}
              // using androidLayerType to avoid app crashes when webview isn't visible
              androidLayerType={isVisible ? 'hardware' : 'software'}
              onError={onWebViewError}
            />
          </TouchableWithoutFeedback>
        )}

        {isLoading && (
          <View style={styles.loadingView}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      </View>

      {!isPortraitOrientation && isHorizontalModeHeaderShown && (
        <View style={styles.horizontalModeHeader}>
          <TouchableOpacity activeOpacity={0.7} onPress={hide}>
            <CloseWithBackgroundIcon />
          </TouchableOpacity>
          <Text style={styles.horizontalModeTitle}>{eventName}</Text>
        </View>
      )}

      {isEndedStreamViewShown && (
        <EndedStreamView
          onClose={hide}
          eventImageUrl={eventImageUrl}
          eventName={eventName}
        />
      )}

      {liveStreamStatus === LIVE_STREAM_STATUSES.PENDING && (
        <CountdownTimer
          onClose={hide}
          eventImageUrl={eventImageUrl}
          eventDate={eventDate}
          eventTimezone={eventTimezone}
          eventName={eventName}
          eventLiveStreamStatus={liveStreamStatus}
        />
      )}
    </Animated.View>
  );
});

EventLiveStreamAndroid.defaultProps = {
  eventImageUrl: null,
  eventDate: null,
  eventTimezone: null,
  onClose: undefined,
};

EventLiveStreamAndroid.propTypes = {
  eventId: PropTypes.string.isRequired,
  eventName: PropTypes.string.isRequired,
  eventLiveStreamStatus: PropTypes.string.isRequired,
  eventImageUrl: PropTypes.string,
  eventDate: PropTypes.string,
  eventTimezone: PropTypes.string,
  onClose: PropTypes.func,
};

export default React.memo(EventLiveStreamAndroid);
