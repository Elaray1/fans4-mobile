import { apiClient } from 'helpers/api';

export const getEvents = ({
  isFan, page, perPage, statuses, unfinished, isOnlyNotFinshedIfCanceled,
}) => apiClient
  .get(isFan ? 'events' : 'events/current-fighter', {
    page,
    perPage,
    ...(statuses && { statuses }),
    ...(unfinished && { unfinished }),
    ...(isOnlyNotFinshedIfCanceled && { isOnlyNotFinshedIfCanceled }),
  });
