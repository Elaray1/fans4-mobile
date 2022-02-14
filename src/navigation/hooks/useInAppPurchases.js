import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import * as purchasesActions from 'store/purchases/purchases.actions';
import inAppPurhaseService from 'services/inAppPurhase.service.ios';
import * as paymentApi from 'resources/payment/payment.api';
import * as userActions from 'resources/user/user.actions';
import * as userSelectors from 'resources/user/user.selectors';

const useInAppPurchases = () => {
  const dispatch = useDispatch();
  const userAuthenticated = useSelector(userSelectors.getAuthenticated);

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }

    const initIap = async () => {
      try {
        await inAppPurhaseService.connect();
      } catch (err) {
        console.error('in app purchases connection error', err);
        return;
      }

      inAppPurhaseService.setPurchaseListener(async (purchase) => {
        try {
          const { isProcessed } = await paymentApi.checkIfIosTransactionProcessed({
            appleTransactionId: purchase.transactionId,
          });

          if (isProcessed) {
            await inAppPurhaseService.finishMakingPurchase(purchase);
            return;
          }
        } catch (err) {
          console.error('check if ios transaction processed err:', err);
          return;
        }

        let user;

        try {
          const metadata = await inAppPurhaseService.getSavedPurchaseMetadata(purchase.productId);

          user = await paymentApi.verifyAppleReceipt({
            productId: purchase.productId,
            receipt: purchase.transactionReceipt,
            fighterId: metadata.fighterId,
          });
        } catch (err) {
          dispatch(purchasesActions.finishPurchaseProcessing());
          console.error('verifyAppleReceipt error:', err);
          return;
        }

        dispatch(userActions.setUserData(user));
        dispatch(purchasesActions.finishPurchaseProcessing());

        await inAppPurhaseService.finishMakingPurchase(purchase);
      });

      inAppPurhaseService.setPurchaseErrorListener((err) => {
        console.error('in app purchases error:', err);
        dispatch(purchasesActions.finishPurchaseProcessing());
      });
    };

    if (userAuthenticated) {
      initIap();
    } else {
      return () => inAppPurhaseService.disconnect();
    }
  }, [dispatch, userAuthenticated]);
};

export default useInAppPurchases;
