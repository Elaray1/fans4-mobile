import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, ActivityIndicator, TouchableOpacity, AppState } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

import checkIfSubscriptionChanged from 'helpers/checkIfSubscriptionChanged';

import * as userSelectors from 'resources/user/user.selectors';

import * as userApi from 'resources/user/user.api';
import { USER_STATUSES } from 'resources/user/user.constants';
import * as userActions from 'resources/user/user.actions';

import * as socketService from 'services/socket.service';

import useToast from 'hooks/useToast';

import Text from 'components/Text';
import GrayscaledImage from 'components/GrayscaledImage';

import { toFixLength } from 'helpers/modifyText';

import colors from 'themes/colors';

import styles from './styles';

const FanAccount = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { showFailure } = useToast();
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [fighters, setFighters] = useState([]);

  const fullName = useSelector(userSelectors.getUserFullName);
  const email = useSelector(userSelectors.getUserEmail);
  const userName = useSelector(userSelectors.getUserName);
  const userSubscriptions = useSelector(userSelectors.getSupportedFighters);

  const goToFighterAccount = useCallback((_id) => {
    navigation.navigate('Fighter', { _id });
  }, [navigation]);

  const updateSubscriptionIfNeeded = useCallback(async () => {
    try {
      const fetchedUser = await userApi.getUserData();
      const isChanged = checkIfSubscriptionChanged(userSubscriptions, fetchedUser.role.subscription.fighters);

      if (isChanged) {
        dispatch(userActions.setFanSubscriptions(fetchedUser?.role?.subscription?.fighters));
      }
    } catch (err) {
      console.error('getting user data error:', err);
    }
  }, [dispatch, userSubscriptions]);

  useEffect(() => {
    const checkSubscriptionsOnFocus = (appState) => {
      if (appState === 'active') {
        updateSubscriptionIfNeeded();
      }
    };

    AppState.addEventListener('change', checkSubscriptionsOnFocus);

    return () => {
      AppState.removeEventListener('change', checkSubscriptionsOnFocus);
    };
  }, [navigation, updateSubscriptionIfNeeded]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', updateSubscriptionIfNeeded);
    return unsubscribe;
  }, [navigation, updateSubscriptionIfNeeded]);

  useEffect(() => {
    const updateUserSubscriptions = async () => {
      setIsLoading(true);

      try {
        const { fighters: fetchedFighters } = await userApi.getMyFighters();
        setFighters(fetchedFighters);
      } catch (err) {
        console.error(err);
        showFailure();
      }

      setIsLoading(false);
    };

    updateUserSubscriptions();
  }, [dispatch, showFailure]);

  useEffect(() => {
    socketService.on('supportedFighter:status-updated', ({ _id, status }) => {
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

  const shownFighters = fighters.filter((f) => {
    const fighterSubscription = userSubscriptions.find(s => s._id === f._id);
    return fighterSubscription
      && (fighterSubscription.autorenewal || moment(fighterSubscription.renewalDate).isAfter(new Date()));
  });

  const Loader = () => (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  const supportedFighterView = (item, i) => {
    const subscription = userSubscriptions.find(s => s._id === item._id);

    const { nickname } = item.role.biography;
    const { cityName, stateCode } = item.role.biography.hometown;

    return (
      <TouchableOpacity
        onPress={() => goToFighterAccount(item._id)}
        activeOpacity={0.7}
        style={[styles.fighter, i !== (fighters.length - 1) && styles.line]}
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

        <View>
          <Text style={styles.fullName}>{item.fullName}</Text>
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
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.content}>
      <View style={styles.account}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{userName}</Text>
          <Text style={styles.caption}>({t('AccountFan.username')})</Text>
        </View>
        <Text style={styles.grayText}>{fullName} • {email}</Text>
      </View>

      {isLoading ? <Loader /> : (
        <View style={styles.subscriptions}>
          <Text style={[styles.title, !shownFighters.length && styles.emptyView]}>
            {t('AccountFan.YourSubscriptions')}
          </Text>

          {shownFighters.map(supportedFighterView)}
        </View>
      )}

      <View style={styles.textContainer}>
        <Text style={styles.grayText}>{t('AccountFan.YouCantSubscribe')}
        </Text>
      </View>
    </ScrollView>
  );
};

export default React.memo(FanAccount);
