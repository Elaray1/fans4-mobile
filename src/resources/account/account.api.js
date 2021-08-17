import { apiClient } from 'helpers/api';

export const createStripePayoutAccountUpdatingLink = () => apiClient
  .post('/accounts/stripe/payout/link');

export const getStripePayoutAccount = () => apiClient
  .get('accounts/stripe/payout');

export const saveStripePayoutAccount = ({ token, userId, stripeAccountId }) => apiClient
  .post('accounts/stripe/payout/saving', { token, userId, stripeAccountId });

export const createStripePayoutAccount = () => apiClient
  .post('accounts/stripe/payout');

export const deleteStripePayoutAccount = () => apiClient
  .delete('accounts/stripe/payout');
