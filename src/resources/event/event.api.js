import { apiClient } from 'helpers/api';

export const getEvents = ({ page, perPage, eventTypes }) => apiClient
  .get('events', {
    page,
    perPage,
    ...(eventTypes && { eventTypes }),
  });
