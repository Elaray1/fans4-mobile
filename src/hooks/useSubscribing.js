import { useCallback, useState } from 'react';
import { Linking, Alert, Platform } from 'react-native';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Config from 'react-native-config';

import * as userSelectors from 'resources/user/user.selectors';
import * as userApi from 'resources/user/user.api';
import { SUBSCRIPTION_PLATFORMS } from 'resources/user/user.constants';
import * as paymentsApi from 'resources/payment/payment.api';

import useToast from 'hooks/useToast';

import inAppPurhaseService from 'services/inAppPurhase.service.ios';

import * as purchasesActions from 'store/purchases/purchases.actions';
import * as purchasesSelectors from 'store/purchases/purchases.selectors';

const IOS_SUBSCRIPTIONS_DEEP_LINK = Config.APP_ENV === 'PROD'
  ? 'https://apps.apple.com/account/subscriptions'
  : 'App-Prefs:STORE';


const getIosSubscriptionNumberFromProductId = productId => parseInt(productId.split('.').pop(), 10) + 1;

const addSuffixToNumber = (i) => {
  const j = i % 10;
  const k = i % 100;

  if (j === 1 && k !== 11) {
    return `${i}st`;
  }
  if (j === 2 && k !== 12) {
    return `${i}nd`;
  }
  if (j === 3 && k !== 13) {
    return `${i}rd`;
  }

  return `${i}th`;
};

const useSubscribing = ({ fighterId }) => {
  const [isMakingPurchase, setIsMakingPurchase] = useState(false);

  const { showFailure } = useToast();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const userSubscriptions = useSelector(userSelectors.getAllSupportedFighters);
  const subscription = userSubscriptions.find(f => f._id === fighterId);

  const finishMakingPurchaseAfterSucessPayment = useCallback(() => {
    setIsMakingPurchase(false);
  }, [setIsMakingPurchase]);

  const isPurchaseProcessing = useSelector(purchasesSelectors.getIsPurchaseInProcessing);

  const unsubscribe = useCallback((defaultSubscription) => {
    const updatedSubscription = defaultSubscription || subscription;

    if (updatedSubscription.platform === 'web') {
      Alert.alert(t('Fighter.unsubscribe'), t('Fighter.noPossibilityToUnsubscribeInApp'), [{ text: t('Fighter.ok') }]);
      return;
    }

    if (updatedSubscription.platform === SUBSCRIPTION_PLATFORMS.IOS) {
      if (Platform.OS === 'android') {
        Alert.alert(
          t('Fighter.unsubscribe'),
          t('Fighter.youSubscribedToThisFighterInIos'),
          [{ text: t('Fighter.ok') }],
        );
        return;
      }

      // eslint-disable-next-line max-len
      const unsubscribeText = `${t('Fighter.unsubscribeText1')}${addSuffixToNumber(getIosSubscriptionNumberFromProductId(updatedSubscription.apple.productId))}${t('Fighter.unsubscribeText2')}${moment(updatedSubscription.renewalDate).format('MMM DD, YYYY')}`;

      Alert.alert(t('Fighter.unsubscribe'), unsubscribeText, [
        { text: t('Fighter.keepIt') },
        { text: t('Fighter.unsubscribe'), onPress: () => Linking.openURL(IOS_SUBSCRIPTIONS_DEEP_LINK) },
      ]);
    }
  }, [t, subscription]);

  const resubscribe = useCallback((defaultSubscription) => {
    const updatedSubscription = defaultSubscription || subscription;

    if (updatedSubscription.platform === SUBSCRIPTION_PLATFORMS.IOS && Platform.OS === 'ios') {
      // eslint-disable-next-line max-len
      const resubscribeText = `${t('Fighter.youWillBeRedirectedToResubscribeTo1')}${addSuffixToNumber(getIosSubscriptionNumberFromProductId(updatedSubscription.apple.productId))}${t('Fighter.youWillBeRedirectedToResubscribeTo2')}`;

      Alert.alert('Resubscribe', resubscribeText, [
        { text: 'No', style: 'cancel' },

        { text: 'Yes', onPress: () => Linking.openURL(IOS_SUBSCRIPTIONS_DEEP_LINK) },
      ]);

      return;
    }

    Alert.alert('Resubscribe', t('Fighter.noPossibilityToResubscribe'), [
      { text: 'OK' },
    ]);
  }, [subscription, t]);

  const subscribe = useCallback(async (defaultFighterId) => {
    const updatedFighterId = defaultFighterId || fighterId;

    setIsMakingPurchase(true);

    try {
      let fetchedUser;

      try {
        fetchedUser = await userApi.getUserData();
      } catch (err) {
        console.error(err);
        showFailure();

        setIsMakingPurchase(false);
        dispatch(purchasesActions.finishPurchaseProcessing());

        return;
      }

      const boughtIosProductIds = fetchedUser.role.subscription.fighters
        .filter(s => s.platform === SUBSCRIPTION_PLATFORMS.IOS)
        .map(s => s.apple.productId);

      const boughtOnIosButExpiredSubscription = fetchedUser.role.subscription.fighters.find((s) => {
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
        setIsMakingPurchase(false);

        try {
          await paymentsApi.notifyAboutIosProductLimit({ fighterId });
        } catch (err) {
          console.error('notifyAboutIosProductLimit err:', err);
        }

        showFailure(t('Fighter.maxInAppSubscriptions'));

        return;
      }

      await inAppPurhaseService.makePurchase(buyingProductId, { fighterId: updatedFighterId });

      dispatch(purchasesActions.startPurchaseProcessing());
    } catch (err) {
      if (err.code !== 'E_USER_CANCELLED') {
        showFailure();
      }

      console.error(err);

      setIsMakingPurchase(false);
      dispatch(purchasesActions.finishPurchaseProcessing());
    }
  }, [dispatch, fighterId, showFailure, t]);

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
