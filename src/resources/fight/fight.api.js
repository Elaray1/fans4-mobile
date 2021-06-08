import { apiClient } from 'helpers/api';

export const getFights = ({
  page, perPage, eventId, fightTypes,
}) => apiClient
  .get('fights', {
    page,
    perPage,
    ...(eventId && { eventId }),
    ...(fightTypes && { fightTypes }),
  });
