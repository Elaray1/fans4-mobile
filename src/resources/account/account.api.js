import { apiClient } from 'helpers/api';

export const getUserAccount = () => apiClient
  .get('accounts');

export const createUserAccount = () => apiClient
  .post('accounts');
