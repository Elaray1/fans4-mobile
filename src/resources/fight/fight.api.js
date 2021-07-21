import { apiClient } from 'helpers/api';

export const getFights = ({
  page, perPage, eventId, statuses, betweenFighterIds, createdByMe,
}) => apiClient
  .get('fights', {
    page,
    perPage,
    ...(eventId && { eventId }),
    ...(statuses && { statuses }),
    ...(betweenFighterIds && { betweenFighterIds }),
    ...(createdByMe && { createdByMe }),
  });

export const create = ({ fighterIds }) => apiClient.post('fights', { fighterIds });

export const vote = ({ fightId }) => apiClient.post('fights/voting', { fightId });

export const unvote = ({ fightId }) => apiClient.delete('fights/voting', { fightId });
