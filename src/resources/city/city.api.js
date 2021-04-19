import { apiClient } from 'helpers/api';

export const getCities = ({ page, perPage, search }) => apiClient
  .get('cities', {
    page,
    perPage,
    ...(search && { search }),
  });
