import { useEffect } from 'react';

import * as eventApi from 'resources/event/event.api';

const useStreamLink = ({ setEventStreamLink, eventStreamLink, eventId }) => {
  useEffect(() => {
    const getStreamLink = async () => {
      if (!eventStreamLink) {
        const { link } = await eventApi.getStreamLinkByEventId(eventId);
        setEventStreamLink(link);
      }
    };

    getStreamLink();
  }, [eventStreamLink, eventId, setEventStreamLink]);
};

export default useStreamLink;
