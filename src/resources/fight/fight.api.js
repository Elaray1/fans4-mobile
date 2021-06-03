import { apiClient } from 'helpers/api';

export const getFights = ({ page, perPage, eventId }) => apiClient
  .get('fights', {
    page,
    perPage,
    ...(eventId && { eventId }),
  });
