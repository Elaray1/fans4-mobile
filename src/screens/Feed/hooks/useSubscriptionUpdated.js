import { useCallback, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';

import * as userApi from 'resources/user/user.api';
import * as userSelectors from 'resources/user/user.selectors';
import * as userActions from 'resources/user/user.actions';

import isSubscribedService from 'services/isSubscribed.service';

import { FANS4_ACCOUNT } from 'helpers/constants';

const usePrevious = (value) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

const checkIfSomeSubscriptionAddedOrRemoved = (oldSupportedFighters, newSupportedFighters) => {
  let oldOnes = (oldSupportedFighters || [])
    .filter(f => f._id !== FANS4_ACCOUNT._id && isSubscribedService.isSubscribed({ subscriptionToFighter: f }));

  let newOnes = (newSupportedFighters || [])
    .filter(f => f._id !== FANS4_ACCOUNT._id && isSubscribedService.isSubscribed({ subscriptionToFighter: f }));

  if (oldOnes.length !== newOnes.length) {
    return true;
  }

  oldOnes = _.sortBy(oldOnes, '_id');
  newOnes = _.sortBy(newOnes, '_id');

  return oldOnes.some((f, i) => {
    const oldSubscription = f;
    const newSubscription = newOnes[i];

    return oldSubscription._id !== newSubscription._id;
  });
};

const useSubscriptionUpdated = ({ fetchNewItems, isFetchedFirstTime, onRefresh }) => {
  const dispatch = useDispatch();
  const fightersList = useSelector(userSelectors.getSupportedFighters);
  const previousFightersList = usePrevious(fightersList);

  const updateSubscriptionIfNeeded = useCallback(async () => {
    if (!isFetchedFirstTime) {
      return;
    }

    try {
      const fetchedUser = await userApi.getUserData();
      const isChanged = checkIfSomeSubscriptionAddedOrRemoved(fightersList, previousFightersList);
      if (isChanged) {
        dispatch(userActions.setUserData(fetchedUser));
        onRefresh();
      }
    } catch (err) {
      console.error('getting user data error:', err);
    }
  }, [dispatch, fightersList, previousFightersList, onRefresh, isFetchedFirstTime]);

  useEffect(() => {
    fetchNewItems({ refresh: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const checkSubscriptionsWhenAppInForeground = (appState) => {
      if (appState === 'active') {
        updateSubscriptionIfNeeded();
      }
    };

    AppState.addEventListener('change', checkSubscriptionsWhenAppInForeground);
    return () => AppState.removeEventListener('change', checkSubscriptionsWhenAppInForeground);
  }, [updateSubscriptionIfNeeded, isFetchedFirstTime]);

  useEffect(() => {
    updateSubscriptionIfNeeded();
  }, [updateSubscriptionIfNeeded, fightersList]);
};

export default useSubscriptionUpdated;
