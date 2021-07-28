import { apiClient } from 'helpers/api';

export const getEvents = ({
  page, perPage, statuses, withoutResults, notPastByDate,
}) => apiClient
  .get('events', {
    page,
    perPage,
    ...(statuses && { statuses }),
    ...(withoutResults && { withoutResults }),
    ...(notPastByDate && { notPastByDate }),
  });

export const getEventsForCurrentFighter = ({ withoutResults, page, perPage }) => apiClient
  .get('events/current-fighter', {
    page,
    perPage,
    ...(withoutResults && { withoutResults }),
  });
