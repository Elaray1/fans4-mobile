import { START_PURCHASE_PROCESSING, FINISH_PURCHASE_PROCESSING } from './purchases.constants';

export const startPurchaseProcessing = () => {
  return { type: START_PURCHASE_PROCESSING };
};

export const finishPurchaseProcessing = () => {
  return { type: FINISH_PURCHASE_PROCESSING };
};
