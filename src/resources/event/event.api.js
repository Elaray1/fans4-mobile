import { apiClient } from 'helpers/api';

export const getEvents = ({
  page, perPage, eventTypes, unfinished,
}) => apiClient
  .get('events', {
    page,
    perPage,
    ...(eventTypes && { eventTypes }),
    ...(unfinished && { unfinished }),
  });
