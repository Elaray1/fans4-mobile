import { useEffect } from 'react';

import websocketsService from 'services/socket.service';

const useEventUpdated = ({ onEventUpdated, eventId }) => {
  useEffect(() => {
    const updateEvent = (updatedEvent) => {
      onEventUpdated(updatedEvent);
    };

    websocketsService.joinRoom(`event-${eventId}`);
    websocketsService.on(`event-${eventId}:updated`, updateEvent);

    return () => {
      websocketsService.off(`event-${eventId}:updated`, updateEvent);
      websocketsService.leaveRoom(`event-${eventId}`);
    };
  }, [eventId, onEventUpdated]);
};

export default useEventUpdated;
