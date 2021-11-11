import { apiClient } from 'helpers/api';

export const getFights = ({
  page, perPage, eventId, statuses, betweenFighterIds, createdByMe, sortOption, hasVotes,
}) => apiClient
  .get('fights', {
    page,
    perPage,
    ...(eventId && { eventId }),
    ...(statuses && { statuses }),
    ...(sortOption && { sortOption }),
    ...(betweenFighterIds && { betweenFighterIds }),
    ...(createdByMe && { createdByMe }),
    ...(hasVotes && { hasVotes }),
  });

export const getFightsForVoting = () => apiClient
  .get('fights/fights-for-voting');

export const create = ({ fighterIds }) => apiClient.post('fights', { fighterIds });

export const vote = ({ fightId, isYes }) => apiClient.post('fights/voting', { fightId, isYes });

export const suggestFight = ({ firstFighterId, secondFighterId }) => apiClient
  .post('fights/suggest', { firstFighterId, secondFighterId });
