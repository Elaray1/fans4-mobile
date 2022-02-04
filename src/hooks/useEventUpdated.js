import { useEffect } from 'react';
import { AppState } from 'react-native';

import websocketsService from 'services/socket.service';

import * as eventApi from 'resources/event/event.api';

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

  useEffect(() => {
    const updateEvent = async (appState) => {
      if (appState === 'active') {
        try {
          const updatedEvent = await eventApi.getEvent(eventId);
          onEventUpdated(updatedEvent);
        } catch (err) {
          console.error('Failed updating event after app went to foreground', err);
        }
      }
    };

    AppState.addEventListener('change', updateEvent);
    return () => AppState.removeEventListener('change', updateEvent);
  }, [eventId, onEventUpdated]);
};

export default useEventUpdated;
