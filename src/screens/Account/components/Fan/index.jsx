import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, ScrollView, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import moment from 'moment';

import * as userSelectors from 'resources/user/user.selectors';
import * as userApi from 'resources/user/user.api';
import { USER_STATUSES, SUBSCRIPTION_PLATFORMS } from 'resources/user/user.constants';

import * as paymentApi from 'resources/payment/payment.api';

import inAppPurhaseService from 'services/inAppPurhase.service.ios';
import websocketsService from 'services/socket.service';

import useToast from 'hooks/useToast';

import FlatList from 'components/FlatList';
import Text from 'components/Text';
import GrayscaledImage from 'components/GrayscaledImage';
import Button from 'components/Button';

import { toFixLength } from 'helpers/modifyText';

import colors from 'themes/colors';

import styles from './styles';
import NoSubscriptions from '../NoSubscriptions';

const FanAccount = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { showFailure, showSuccess } = useToast();
  const navigation = useNavigation();

  const listRef = useRef(null);
  useScrollToTop(listRef);

  const [isLoading, setIsLoading] = useState(false);
  const [fighters, setFighters] = useState([]);

  const fullName = useSelector(userSelectors.getUserFullName);
  const email = useSelector(userSelectors.getUserEmail);
  const userName = useSelector(userSelectors.getUserName);
  const userSubscriptions = useSelector(userSelectors.getSupportedFighters);

  const goToFighterAccount = useCallback((_id) => {
    navigation.navigate('Fighter', { _id });
  }, [navigation]);

  const updateUserSubscriptions = useCallback(async () => {
    setIsLoading(true);

    try {
      const { fighters: fetchedFighters } = await userApi.getMyFighters();
      setFighters(fetchedFighters);
    } catch (err) {
      console.error(err);
      showFailure();
    }

    setIsLoading(false);
  }, [showFailure]);

  useEffect(() => {
    updateUserSubscriptions();
  }, [dispatch, showFailure, updateUserSubscriptions, userSubscriptions]);

  useEffect(() => {
    websocketsService.on('supportedFighter:status-updated', ({ _id, status }) => {
      const updatedFighters = fighters.map((f) => {
        if (f._id !== _id) {
          return f;
        }

        return {
          ...f,
          status,
        };
      });

      setFighters(updatedFighters);
    });
  }, [fighters]);

  const [isRestoringPurchases, setIsRestoringPurchases] = useState();

  const restorePurchases = useCallback(async () => {
    setIsRestoringPurchases(true);

    try {
      const purchases = await inAppPurhaseService.getAvailablePurchases();
      if (!purchases || !purchases.length) {
        showSuccess(t('AccountFan.purchasesHaveBeenRestored'));
      }

      // eslint-disable-next-line no-restricted-syntax
      for (const purchase of purchases) {
        // eslint-disable-next-line no-await-in-loop
        await paymentApi.restoreIosPurchases({
          receipt: purchase.transactionReceipt,
          productId: purchase.productId,
        });
      }

      showSuccess(t('AccountFan.purchasesHaveBeenRestored'));
    } catch (err) {
      if (err.code !== 'E_USER_CANCELLED') {
        console.error('restoring purchases err:', err);
        showFailure();
      }
    }

    setIsRestoringPurchases(false);
  }, [showFailure, showSuccess, t]);

  const Loader = () => (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  const renderItem = ({ item, index }) => {
    const subscription = userSubscriptions.find(s => s._id === item._id);

    if (!subscription) {
      return null;
    }

    const { nickname } = item.role.biography;
    const { cityName, stateCode } = item.role.biography.hometown;

    const isFailedIosSubscription = subscription.platform === SUBSCRIPTION_PLATFORMS.IOS
      && subscription.autorenewal
      && moment(subscription.renewalDate).isBefore(moment())
      && moment(subscription.gracePeriodEndDate).isAfter(moment());

    return (
      <TouchableOpacity
        onPress={() => goToFighterAccount(item._id)}
        activeOpacity={0.7}
        style={[styles.fighter, index !== (fighters.length - 1) && styles.line]}
        key={item._id}
      >
        {item.status === USER_STATUSES.BLOCKED ? (
          <GrayscaledImage
            style={styles.fighterImage}
            source={{ uri: item.avatarUrl }}
          />
        ) : (
          <FastImage
            style={styles.fighterImage}
            source={{ uri: item.avatarUrl }}
          />
        )}

        <View style={{ alignItems: 'flex-start' }}>
          <Text style={styles.fullName}>
            {item.fullName}
          </Text>

          {nickname && (
            <Text style={styles.nickname}>
              “
              {toFixLength({ text: nickname, length: 30 })}
              ”
            </Text>
          )}

          <Text style={styles.city}>
            {toFixLength({ text: cityName, length: 30 })}
            ,
            {' '}
            {toFixLength({ text: stateCode, length: 30 })}
          </Text>

          {!subscription.autorenewal && (
            <Text style={styles.expirationDate}>
              {t('AccountFan.subscriptionExpiresOn')}{' '}{moment(subscription.renewalDate).format('MMM, D, YYYY')}
            </Text>
          )}

          {isFailedIosSubscription && (
            <View style={styles.iosPaymentFailedContainer}>
              <Text style={styles.iosPaymentFailedText}>{t('AccountFan.paymentFailed')}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const keyExtractor = useCallback(item => item._id, []);

  return (
    <ScrollView
      style={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.account}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{userName}</Text>
          <Text style={styles.caption}>({t('AccountFan.username')})</Text>
        </View>

        <Text style={styles.grayText}>{fullName} • {email}</Text>

        {Platform.OS === 'ios' && (
          <Button
            style={styles.restoreButton}
            onPress={restorePurchases}
            title={t('AccountFan.restorePurchases')}
            type="secondary"
            isLoading={isRestoringPurchases}
          />
        )}
      </View>

      {isLoading && !isRestoringPurchases && <Loader />}

      {(!isLoading || isRestoringPurchases) && !fighters.length && (
        <>
          {Platform.OS === 'android' ? (
            <Text style={styles.title}>
              {t('AccountFan.YourSubscriptions')}
            </Text>
          ) : <NoSubscriptions />}
        </>
      )}

      {(!isLoading || isRestoringPurchases) && !!fighters.length && (
        <View style={styles.subscriptions}>
          <Text style={styles.title}>
            {t('AccountFan.YourSubscriptions')}
          </Text>

          <FlatList
            ref={listRef}
            data={fighters}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
          />
        </View>
      )}
      {Platform.OS === 'android' && (
        <View style={styles.textContainer}>
          <Text style={styles.grayText}>{t('AccountFan.YouCantSubscribe')}</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default React.memo(FanAccount);
