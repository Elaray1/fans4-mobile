import { apiClient } from 'helpers/api';

export const getUserIncome = () => apiClient
  .get('payouts/income');
