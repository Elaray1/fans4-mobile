import React, { useEffect, useState, useMemo, useCallback, useImperativeHandle, useRef } from 'react';
import { AppState, View, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import * as eventApi from 'resources/event/event.api';
import { LIVE_STREAM_STATUSES } from 'resources/event/event.constants';

import useEventUpdated from 'hooks/useEventUpdated';

import Video from 'components/Video';

import styles from './styles';

const FINISHED_STREAM_STATUSES = [LIVE_STREAM_STATUSES.PROCESSING, LIVE_STREAM_STATUSES.FINISHED];

const LiveStreamPlayerIos = React.forwardRef(({
  eventId,
  eventLiveStreamStatus,
  onReadyToPlay,
  onExitFullScreen,
  onFullscreenOpened,
}, ref) => {
  const { t } = useTranslation();

  const [eventStreamLink, setEventStreamLink] = useState(null);
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);

  const [isLiveStreamShownIos, setIsLiveStreamShownIos] = useState(false);
  const [wasLiveStreamEndAlertShown, setWasLiveStreamEndAlertShown] = useState(false);
  const [isFinishedStream, setIsFinishedStream] = useState(FINISHED_STREAM_STATUSES.includes(eventLiveStreamStatus));
  const [isLiveStream, setIsLiveStream] = useState(eventLiveStreamStatus === LIVE_STREAM_STATUSES.LIVE);

  const onEventUpdated = useCallback((updatedEvent) => {
    setIsFinishedStream(FINISHED_STREAM_STATUSES.includes(updatedEvent.liveStream.status));
    setIsLiveStream(updatedEvent.liveStream.status === LIVE_STREAM_STATUSES.LIVE);
  }, []);

  useEventUpdated({ eventId, onEventUpdated });

  const videoRef = useRef();

  const getStreamLink = useCallback(async () => {
    if (isLiveStream) {
      const { link, width: streamWidth, height: streamHeight } = await eventApi.getStreamLinkByEventId(eventId);

      setEventStreamLink(link);
      setWidth(streamWidth);
      setHeight(streamHeight);
    }
  }, [eventId, isLiveStream]);

  useImperativeHandle(ref, () => ({
    closeFullScreen: () => {
      videoRef.current.closeFullScreen();
    },
    showFullScreen: () => {
      videoRef.current.showFullScreen();
    },
    reload: async () => {
      setEventStreamLink(null);
      setWasLiveStreamEndAlertShown(false);
      await getStreamLink();
    },
  }));

  const onExitFullScreenIos = useCallback(() => {
    setIsLiveStreamShownIos(false);

    if (onExitFullScreen) {
      onExitFullScreen();
    }
  }, [onExitFullScreen]);

  const onFullscreenOpenedIos = useCallback(() => {
    setIsLiveStreamShownIos(true);

    if (onFullscreenOpened) {
      onFullscreenOpened();
    }
  }, [onFullscreenOpened]);

  useEffect(() => {
    AppState.addEventListener('change', (state) => {
      if (state !== 'active') {
        videoRef.current.play();
        return;
      }

      videoRef.current.pause();
    });
  }, []);

  useEffect(() => {
    getStreamLink();
  }, [getStreamLink]);

  const videoSource = useMemo(() => ({ uri: eventStreamLink }), [eventStreamLink]);

  const showStreamEndedAlert = useCallback(() => {
    Alert.alert(t('EventFights.liveStreamHasEnded'), t('EventFights.videoWillBeAvailableSoon'), [
      {
        text: t('EventFights.ok'),
      },
    ]);
  }, [t]);

  const checkAndFinishStream = useCallback(async () => {
    if (!wasLiveStreamEndAlertShown && isLiveStreamShownIos) {
      if (isFinishedStream) {
        videoRef.current.closeFullScreen();

        setWasLiveStreamEndAlertShown(true);
        showStreamEndedAlert();
        return;
      }

      try {
        const updatedEvent = await eventApi.getEvent(eventId);
        onEventUpdated(updatedEvent);

        if (updatedEvent.liveStream.status === LIVE_STREAM_STATUSES.PROCESSING) {
          videoRef.current.closeFullScreen();

          setWasLiveStreamEndAlertShown(true);
          showStreamEndedAlert();
        }
      } catch (err) {
        console.error('fetching event err:', err);
      }
    }
  }, [showStreamEndedAlert, wasLiveStreamEndAlertShown,
    isFinishedStream, isLiveStreamShownIos, eventId, onEventUpdated]);

  return (
    <View style={styles.videoContainer}>
      {eventStreamLink && (
        <Video
          ref={videoRef}
          isLive
          viewable
          playOnStart
          width={width}
          height={height}
          source={videoSource}
          muted={!isLiveStreamShownIos}
          onExitFullScreen={onExitFullScreenIos}
          pauseOnFullScreen={false}
          onReadyToPlay={onReadyToPlay}
          onFullscreenPlayerDidPresent={onFullscreenOpenedIos}
          onStreamStopIos={checkAndFinishStream}
          onStreamPlayableTimeReached={checkAndFinishStream}
        />
      )}
    </View>
  );
});

LiveStreamPlayerIos.propTypes = {
  eventId: PropTypes.string.isRequired,
  onReadyToPlay: PropTypes.func.isRequired,
  onExitFullScreen: PropTypes.func,
  onFullscreenOpened: PropTypes.func,
  eventLiveStreamStatus: PropTypes.oneOf(Object.values(LIVE_STREAM_STATUSES)).isRequired,
};

LiveStreamPlayerIos.defaultProps = {
  onExitFullScreen: undefined,
  onFullscreenOpened: undefined,
};

export default React.memo(LiveStreamPlayerIos);
