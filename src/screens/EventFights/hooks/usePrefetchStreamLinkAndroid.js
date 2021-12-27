import { useEffect } from 'react';
import Platform from 'react-native';

import * as eventApi from 'resources/event/event.api';
import { LIVE_STREAM_STATUSES } from 'resources/event/event.constants';


const usePrefetchLinkAndroid = ({ eventId, setEventStreamLink, eventLiveStreamStatus }) => {
  useEffect(() => {
    if (Platform.OS === 'ios' || eventLiveStreamStatus !== LIVE_STREAM_STATUSES.LIVE) {
      return;
    }

    const getStreamLink = async () => {
      const { link } = await eventApi.getStreamLinkByEventId(eventId);
      setEventStreamLink(link);
    };

    getStreamLink();
  }, [eventId, setEventStreamLink, eventLiveStreamStatus]);
};

export default usePrefetchLinkAndroid;
