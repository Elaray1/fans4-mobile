import { START_PURCHASE_PROCESSING, FINISH_PURCHASE_PROCESSING } from './purchases.constants';

export default (state = {}, action) => {
  switch (action.type) {
    case START_PURCHASE_PROCESSING:
      return {
        isProcessing: true,
      };

    case FINISH_PURCHASE_PROCESSING:
      return {
        isProcessing: false,
      };

    default:
      return state;
  }
};
