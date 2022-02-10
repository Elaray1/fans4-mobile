import { useEffect, useState, useRef, useCallback } from 'react';

import useDidUpdate from 'hooks/useDidUpdate';
import useEventUpdated from 'hooks/useEventUpdated';
import useToast from 'hooks/useToast';

import * as eventApi from 'resources/event/event.api';
import { LIVE_STREAM_STATUSES } from 'resources/event/event.constants';

const useEventUpdating = ({
  eventId,
  setWasReadyToPlayback,
  setIsLoading,
  updateEventData,
  liveStreamStatus,
  setIsEndedStreamViewShown,
}) => {
  const { showFailure } = useToast();
  const webViewRef = useRef(null);

  const [streamLink, setStreamLink] = useState(null);

  const onEventUpdated = useCallback((newEvent) => {
    updateEventData(newEvent);

    const didBecomeLive = liveStreamStatus !== LIVE_STREAM_STATUSES.LIVE
      && newEvent.liveStream.status === LIVE_STREAM_STATUSES.LIVE;

    if (didBecomeLive) {
      setStreamLink(null);
      setWasReadyToPlayback(false);
      setIsLoading(true);
      setIsEndedStreamViewShown(false);
    }
  }, [liveStreamStatus, setWasReadyToPlayback, updateEventData, setIsLoading, setIsEndedStreamViewShown]);

  useEventUpdated({ eventId, onEventUpdated });

  const loadEvent = useCallback(async () => {
    setWasReadyToPlayback(false);
    setIsLoading(true);

    try {
      const newEvent = await eventApi.getEvent(eventId);

      updateEventData(newEvent);
      setStreamLink(null);
    } catch (err) {
      showFailure();
      console.error('event updating error:', err);
    }
  }, [eventId, setIsLoading, setWasReadyToPlayback, updateEventData, showFailure]);

  useDidUpdate(() => {
    loadEvent();
  }, [eventId]);

  useEffect(() => {
    const uploadNewLink = async () => {
      if (streamLink === null && liveStreamStatus !== LIVE_STREAM_STATUSES.PENDING) {
        try {
          const { link } = await eventApi.getStreamLinkByEventId(eventId);
          setStreamLink(link);
        } catch (err) {
          showFailure();
          console.error('event updating error:', err);
        }
      }
    };

    uploadNewLink();
  }, [eventId, streamLink, showFailure, liveStreamStatus]);

  return {
    webViewRef,
    streamLink,
    loadEvent,
  };
};

export default useEventUpdating;
