import { useEffect, useState, useCallback } from 'react';

import * as eventApi from 'resources/event/event.api';

const useStreamLink = ({ eventId, prefetchedEventStreamLink, setIsLoading }) => {
  const [eventStreamLink, setEventStreamLink] = useState(prefetchedEventStreamLink);

  const fetchStreamLink = useCallback(async () => {
    setIsLoading(true);

    const { link } = await eventApi.getStreamLinkByEventId(eventId);
    setEventStreamLink(link);
  }, [eventId, setIsLoading]);

  const reloadCurrentStreamLink = useCallback(async () => {
    if (!eventStreamLink) {
      fetchStreamLink();
    }
  }, [eventStreamLink, fetchStreamLink]);

  useEffect(() => {
    reloadCurrentStreamLink();
  }, [reloadCurrentStreamLink]);

  return { eventStreamLink, reloadCurrentStreamLink, fetchStreamLink };
};
export default useStreamLink;
