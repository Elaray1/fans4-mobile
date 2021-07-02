import { apiClient } from 'helpers/api';

export const getStripePayoutAccount = () => apiClient
  .get('accounts/stripe/payout');

export const createStripePayoutAccount = () => apiClient
  .post('accounts/stripe/payout');

export const deleteStripePayoutAccount = () => apiClient
  .delete('accounts/stripe/payout');
