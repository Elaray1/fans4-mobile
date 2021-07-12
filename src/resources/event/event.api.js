import { apiClient } from 'helpers/api';

export const getEvents = ({
  isFan, page, perPage, statuses, withoutResults, notPastByDate,
}) => apiClient
  .get(isFan ? 'events' : 'events/current-fighter', {
    page,
    perPage,
    ...(statuses && { statuses }),
    ...(withoutResults && { withoutResults }),
    ...(notPastByDate && { notPastByDate }),
  });
