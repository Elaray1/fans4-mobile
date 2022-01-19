import { useEffect, useState, useCallback } from 'react';

import * as eventApi from 'resources/event/event.api';

const useStreamLink = ({ eventId, prefetchedEventStreamLink, setIsLoading }) => {
  const [eventStreamLink, setEventStreamLink] = useState(prefetchedEventStreamLink);

  const updateStreamLink = useCallback(async () => {
    if (!eventStreamLink) {
      setIsLoading(true);

      const { link } = await eventApi.getStreamLinkByEventId(eventId);
      setEventStreamLink(link);
    }
  }, [eventId, eventStreamLink, setIsLoading]);

  useEffect(() => {
    updateStreamLink();
  }, [updateStreamLink, setIsLoading]);

  return { eventStreamLink, updateStreamLink };
};
export default useStreamLink;
