import { apiClient } from 'helpers/api';

export const checkIfIosTransactionProcessed = ({ appleTransactionId }) => apiClient.get('payments/ios-transaction', {
  appleTransactionId,
});

export const verifyAppleReceipt = ({ receipt, fighterId, productId }) => apiClient
  .post('payments/ios-subscription-payment', {
    productId,
    receipt,
    fighterId,
  });

export const notifyAboutIosProductLimit = ({ fighterId }) => apiClient.post(
  'payments/ios-product-limit-notification',
  { fighterId },
);
