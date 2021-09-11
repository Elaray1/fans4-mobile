import { apiClient } from 'helpers/api';

export const verifyAppleReceipt = ({ receipt, fighterId, productId }) => apiClient
  .post('payments/ios-subscription-payment', {
    productId,
    receipt,
    fighterId,
  });
