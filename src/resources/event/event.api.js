import { apiClient } from 'helpers/api';

export const getEventsForFan = ({
  page, perPage, past,
}) => apiClient
  .get('events', {
    page,
    perPage,
    ...(past && { past }),
  });

export const getEventsForCurrentFighter = ({ past, page, perPage }) => apiClient
  .get('events/current-fighter', {
    page,
    perPage,
    ...(past && { past }),
  });

export const getStreamLinkByEventId = _id => apiClient
  .get(`events/${_id}/stream-link`);

export const getEvent = _id => apiClient
  .get(`events/${_id}`);
