import { apiClient } from 'helpers/api';

export const getFights = ({
  page, perPage, eventId, statuses, betweenFighterIds,
}) => apiClient
  .get('fights', {
    page,
    perPage,
    ...(eventId && { eventId }),
    ...(statuses && { statuses }),
    ...(betweenFighterIds && { betweenFighterIds }),
  });

export const create = ({ fighterIds }) => apiClient.post('fights', { fighterIds });
