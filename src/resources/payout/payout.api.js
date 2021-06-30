import { apiClient } from 'helpers/api';

export const getUserPayouts = () => apiClient
  .get('payouts');
