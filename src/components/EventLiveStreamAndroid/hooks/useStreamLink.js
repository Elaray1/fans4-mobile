import { useEffect, useState } from 'react';

import * as eventApi from 'resources/event/event.api';

const useStreamLink = ({ eventId, prefetchedEventStreamLink }) => {
  const [eventStreamLink, setEventStreamLink] = useState(prefetchedEventStreamLink);

  useEffect(() => {
    const getStreamLink = async () => {
      if (!eventStreamLink) {
        const { link } = await eventApi.getStreamLinkByEventId(eventId);
        setEventStreamLink(link);
      }
    };

    getStreamLink();
  }, [eventStreamLink, eventId]);

  return eventStreamLink;
};

export default useStreamLink;
