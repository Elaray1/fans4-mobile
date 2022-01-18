import { useEffect, useState } from 'react';

import useDidUpdate from 'hooks/useDidUpdate';

import websocketsService from 'services/socket.service';

const useEventsLiveStreamsUpdated = ({ posts, preloadedEvents }) => {
  const [eventsWithLiveStream, setEventsWithLiveStream] = useState(preloadedEvents || []);

  useDidUpdate(() => {
    setEventsWithLiveStream(preloadedEvents);
  }, [preloadedEvents]);

  useEffect(() => {
    websocketsService.joinRoom('events');
    websocketsService.on('events:liveStreamsUpdated', (events) => {
      setEventsWithLiveStream(events);
    });

    return () => {
      websocketsService.off('events:liveStreamsUpdated', setEventsWithLiveStream);
      websocketsService.leaveRoom('events');
    };
  }, []);


  return eventsWithLiveStream;
};

export default useEventsLiveStreamsUpdated;
