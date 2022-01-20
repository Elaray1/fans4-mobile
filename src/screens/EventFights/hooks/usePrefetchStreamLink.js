import { useEffect } from 'react';
import Platform from 'react-native';

import * as eventApi from 'resources/event/event.api';
import { LIVE_STREAM_STATUSES } from 'resources/event/event.constants';


const usePrefetchLink = ({ eventId, setEventStreamLink, streamStatus }) => {
  useEffect(() => {
    if (streamStatus !== LIVE_STREAM_STATUSES.FINISHED
      && (Platform.OS === 'ios' || streamStatus !== LIVE_STREAM_STATUSES.LIVE)) {
      return;
    }

    const getStreamLink = async () => {
      const { link } = await eventApi.getStreamLinkByEventId(eventId);
      setEventStreamLink(link);
    };

    getStreamLink();
  }, [eventId, setEventStreamLink, streamStatus]);
};

export default usePrefetchLink;
