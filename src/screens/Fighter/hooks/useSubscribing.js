import { useCallback, useState, useEffect } from 'react';
import { Linking, Alert, Platform } from 'react-native';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Config from 'react-native-config';

import * as userSelectors from 'resources/user/user.selectors';
import { SUBSCRIPTION_PLATFORMS } from 'resources/user/user.constants';

import useToast from 'hooks/useToast';

import inAppPurhaseService from 'services/inAppPurhase.service';

import * as purchasesActions from 'store/purchases/purchases.actions';
import * as purchasesSelectors from 'store/purchases/purchases.selectors';

const IOS_SUBSCRIPTIONS_DEEP_LINK = Config.APP_ENV === 'PROD'
  ? 'https://apps.apple.com/account/subscriptions'
  : 'App-Prefs:STORE';


const getIosSubscriptionNumberFromProductId = productId => parseInt(productId.split('.').pop(), 10) + 1;

const useSubscribing = ({ fighterId }) => {
  const [isMakingPurchase, setIsMakingPurchase] = useState(false);

  const { showFailure } = useToast();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const userSubscriptions = useSelector(userSelectors.getSupportedFighters);
  const subscription = userSubscriptions.find(f => f._id === fighterId);

  const finishMakingPurchaseAfterSucessPayment = useCallback(() => {
    setIsMakingPurchase(false);
  }, [setIsMakingPurchase]);

  const isPurchaseProcessing = useSelector(purchasesSelectors.getIsPurchaseInProcessing);

  useEffect(() => {
    if (!isPurchaseProcessing) {
      setIsMakingPurchase(false);
    }
  }, [isPurchaseProcessing, setIsMakingPurchase]);

  const unsubscribe = useCallback(() => {
    if (subscription.platform === 'web') {
      Alert.alert(t('Fighter.unsubscribe'), t('Fighter.noPossibilityToUnsubscribeInApp'), { text: t('Fighter.ok') });
      return;
    }

    if (subscription.platform === SUBSCRIPTION_PLATFORMS.IOS) {
      if (Platform.OS === 'android') {
        Alert.alert(t('Fighter.unsubscribe'), t('Fighter.youSubscribedToThisFighterInIos'), { text: t('Fighter.ok') });
        return;
      }

      // eslint-disable-next-line max-len
      const unsubscribeText = `${t('Fighter.unsubscribeText1')}${getIosSubscriptionNumberFromProductId(subscription.apple.productId)}${t('Fighter.unsubscribeText1')}${moment(subscription.renewalDate).format('MMM DD, YYYY')}`;

      Alert.alert(t('Fighter.unsubscribe'), unsubscribeText, [
        { text: t('Fighter.keepIt') },
        { text: t('Fighter.unsubscribe'), onPress: () => Linking.openURL(IOS_SUBSCRIPTIONS_DEEP_LINK) },
      ]);
    }
  }, [t, subscription]);

  const resubscribe = useCallback(() => {
    // eslint-disable-next-line max-len
    const resubscribeText = `${t('Fighter.youWillBeRedirectedToResubscribeTo')}${getIosSubscriptionNumberFromProductId(subscription.apple.productId)}`;

    Alert.alert('Resubscribe', resubscribeText, [
      { text: 'Continue', onPress: () => Linking.openURL(IOS_SUBSCRIPTIONS_DEEP_LINK) },
    ]);
  }, [subscription, t]);

  const subscribe = useCallback(async () => {
    const boughtIosProductIds = userSubscriptions
      .filter(s => s.platform === SUBSCRIPTION_PLATFORMS.IOS)
      .map(s => s.apple.productId);

    const boughtOnIosButExpiredSubscription = userSubscriptions.find((s) => {
      return s._id === fighterId
        && s.platform === SUBSCRIPTION_PLATFORMS.IOS
        && moment(s.renewalDate).isBefore(moment())
        && moment(s.gracePeriodEndDate).isBefore(moment());
    });

    const buyingProductId = boughtOnIosButExpiredSubscription
      ? boughtOnIosButExpiredSubscription.apple.productId
      : inAppPurhaseService.getAvailableSubscriptionProductIds()
        .find(productId => !boughtIosProductIds.includes(productId));

    if (!buyingProductId) {
      showFailure(t('Fighter.maxInAppSubscriptions'));
      return;
    }

    setIsMakingPurchase(true);

    try {
      await inAppPurhaseService.makePurchase(buyingProductId, { fighterId });
      dispatch(purchasesActions.startPurchaseProcessing());
    } catch (err) {
      setIsMakingPurchase(false);
    }
  }, [dispatch, fighterId, userSubscriptions, showFailure, t]);

  return {
    subscribe,
    unsubscribe,
    resubscribe,
    isMakingPurchase,
    isPurchaseProcessing,
    finishMakingPurchaseAfterSucessPayment,
  };
};

export default useSubscribing;
