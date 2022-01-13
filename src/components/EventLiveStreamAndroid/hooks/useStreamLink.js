import { useEffect } from 'react';

import * as eventApi from 'resources/event/event.api';

const useStreamLink = ({ setEventStreamLink, eventStreamLink, eventId, visible }) => {
  useEffect(() => {
    const getStreamLink = async () => {
      if (!eventStreamLink && visible) {
        const { link } = await eventApi.getStreamLinkByEventId(eventId);
        setEventStreamLink(link);
      }
    };

    getStreamLink();
  }, [eventStreamLink, eventId, setEventStreamLink, visible]);
};

export default useStreamLink;
