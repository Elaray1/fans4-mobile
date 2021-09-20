import { apiClient } from 'helpers/api';

export const getUserActivities = ({ page, perPage }) => apiClient
  .get('activities', { page, perPage });

export const readActivities = () => apiClient
  .put('activities/read');
