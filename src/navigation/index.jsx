import React, { useCallback, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { InteractionManager, AppState, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen';
import { ToastProvider } from 'react-native-fast-toast';
import cookies from '@react-native-cookies/cookies';

import 'react-native-gesture-handler';

import { STORAGE_KEYS, PUSH_NOTIFICATION_TYPES } from 'helpers/constants';
import { getItem } from 'helpers/storage';
import { getMaskedDeviceId } from 'helpers/deviceInfo';
import getInitialScreen from 'helpers/getInitialScreen';
import * as rootNavigation from 'helpers/rootNavigation';

import analyticsService from 'services/analytics.service';
import websocketsService from 'services/socket.service';
import pushNotificationService from 'services/pushNotification.service';
import inAppPurhaseService from 'services/inAppPurhase.service.ios';

import * as userSelectors from 'resources/user/user.selectors';
import * as userActions from 'resources/user/user.actions';
import * as userApi from 'resources/user/user.api';

import * as paymentApi from 'resources/payment/payment.api';

import * as messageActions from 'resources/message/message.actions';

import useToast from 'hooks/useToast';

import { USER_STATUSES } from 'resources/user/user.constants';

import config from 'resources/config';
import store from 'store';
import * as purchasesActions from 'store/purchases/purchases.actions';

import colors from 'themes/colors';

import OfflineBanner from 'components/OfflineBanner';

import AppScreens from './appStack';
import AuthScreens from './authStack';

const NAVIGATOR_CONTAINER_THEME = {
  colors: {
    background: colors.main,
  },
};

const Stack = createStackNavigator();

const init = async (dispatch) => {
  const wasOpenedBefore = await getItem(STORAGE_KEYS.WAS_OPENED_BEFORE);
  if (wasOpenedBefore) {
    analyticsService.logEvent({ name: analyticsService.events.LAUNCH });
  }

  // This is needed because react-native use cookies by default
  // but actually we don't use cookies
  // so we clear cookies in order to prevent mixing authorization cookies
  // with other authorization methods
  try {
    await cookies.clearAll();
  } catch (err) {
    console.log('Clearing cookies error:', err);
  }

  let user;
  const accessToken = await getItem(STORAGE_KEYS.ACCESS_TOKEN);

  if (accessToken) {
    config.accessToken = accessToken;

    try {
      user = await userApi.getUserData();

      websocketsService.connect({
        query: { accessToken },
        rooms: [`user-${user._id}`],
      });


      dispatch(userActions.setUserData(user));
    } catch (err) {
      console.log('Fetching user on start error:', err.message);
    }
  }

  if (!user) {
    websocketsService.connect({
      query: { deviceId: getMaskedDeviceId() },
      rooms: [`device-${getMaskedDeviceId()}`],
    });
  }


  if (rootNavigation.isInitialRoute()) {
    const { stack, screen } = getInitialScreen(user);
    rootNavigation.reset({ routes: [{ name: stack, params: { screen } }] });
  }

  // this is needed to hide splash screen after screen appearing animation
  InteractionManager.runAfterInteractions(() => SplashScreen.hide());
};

const linking = {
  prefixes: [
    'fans4://',
  ],
  config: {
    screens: {
      AppStack: {
        screens: {
          Finances: 'finances/:stripeAccountId',
        },
      },
    },
  },
};

const handleUserStatusUpdated = (user) => {
  store.dispatch(userActions.setUserData(user));

  let screen;

  if (user.status === USER_STATUSES.VERIFIED) {
    const isFirstVerification = (user.statusHistory || [])
      .filter((h => h.status === USER_STATUSES.VERIFIED)).length === 1;

    if (isFirstVerification) {
      screen = 'VerificationSuccessful';
    } else {
      screen = 'Account';
    }
  } else if (user.status === USER_STATUSES.DECLINED) {
    screen = 'VerificationFailed';
  } else if (user.status === USER_STATUSES.BLOCKED) {
    screen = 'AccountBlocked';
  }

  rootNavigation.resetToScreen('AppStack', screen);
};

const handleUserUpdated = (user) => {
  store.dispatch(userActions.setUserData(user));
};

const handleFighterUpdated = (user) => {
  store.dispatch(userActions.setUserData(user));
};

const handleUserActivityIndicatorUpdated = (user) => {
  store.dispatch(userActions.setUserData(user));
};

const handleUserUnreadMessagesUpdated = ({ messageId }) => {
  store.dispatch(messageActions.addUnreadMessage(messageId));
};

AppState.addEventListener('change', async (appState) => {
  if (appState === 'active') {
    try {
      await store.dispatch(userActions.getUserData());
    } catch (err) {
      console.error('Failed updating user after app went to foreground', err);
    }
  }
});

const pushNotificationHandlersByType = {
  [PUSH_NOTIFICATION_TYPES.POST_STATUS_CHANGED]: () => {
    rootNavigation.navigate('Account');
  },
  [PUSH_NOTIFICATION_TYPES.FIGHTER_REGISTRATION_APPROVED]: () => {
    rootNavigation.navigate('VerificationSuccessful');
  },
  [PUSH_NOTIFICATION_TYPES.FIGHTER_REGISTRATION_DECLINED]: () => {
    rootNavigation.navigate('VerificationFailed');
  },
  [PUSH_NOTIFICATION_TYPES.STRIPE_PAYOUT_ACCOUNT_STATUS_CHANGED]: () => {
    rootNavigation.navigate('Finances');
  },
  [PUSH_NOTIFICATION_TYPES.NEW_SUBSCRIBER]: () => {
    rootNavigation.navigate('Activity');
  },
  [PUSH_NOTIFICATION_TYPES.FIGHTER_IN_FIGHT_VOTING]: ({ fight }) => {
    const parsedFight = JSON.parse(fight);

    rootNavigation.navigate('FighterVoting', { fight: parsedFight });
  },
  [PUSH_NOTIFICATION_TYPES.FAN_PROPOSED_FIGHT_IN_VOTING]: ({ fight }) => {
    const parsedFight = JSON.parse(fight);

    rootNavigation.navigate('Voting', { fight: parsedFight });
  },
  [PUSH_NOTIFICATION_TYPES.FAN_PROPOSED_FIGHT_IN_UPCOMING_EVENT]: ({ event }) => {
    const parsedEvent = JSON.parse(event);

    rootNavigation.navigate('EventFights', { event: parsedEvent });
  },
  [PUSH_NOTIFICATION_TYPES.FAN_VOTED_FIGHT_IN_UPCOMING_EVENT]: ({ event }) => {
    const parsedEvent = JSON.parse(event);

    rootNavigation.navigate('EventFights', { event: parsedEvent });
  },
  [PUSH_NOTIFICATION_TYPES.EVENT_PUBLISHED]: ({ event }) => {
    const parsedEvent = JSON.parse(event);

    rootNavigation.navigate('EventFights', { event: parsedEvent });
  },
};

function AppNavigation() {
  const dispatch = useDispatch();
  const userAuthenticated = useSelector(userSelectors.getAuthenticated);
  const { showFailure } = useToast();

  const routeNameRef = useRef();

  const onNavigatorReady = useCallback(async () => {
    routeNameRef.current = rootNavigation.navigationRef.current.getCurrentRoute().name;
    await init(dispatch);
  }, [dispatch]);

  const userType = useSelector(userSelectors.getUserType);
  const userStatus = useSelector(userSelectors.getUserStatus);

  useEffect(() => {
    const handle = async () => {
      if (userAuthenticated) {
        websocketsService.on('user:status-updated', handleUserStatusUpdated);
        websocketsService.on('fighter:updated', handleFighterUpdated);
        websocketsService.on('user:activity-indicator-updated', handleUserActivityIndicatorUpdated);
        websocketsService.on('user:updated', handleUserUpdated);
        websocketsService.on('user:unread-messages-updated', handleUserUnreadMessagesUpdated);

        pushNotificationService.startNotificationHandling(pushNotificationHandlersByType);
      } else {
        pushNotificationService.stopNotificationHandling();

        websocketsService.off('user:status-updated', handleUserStatusUpdated);
        websocketsService.off('fighter:updated', handleFighterUpdated);
        websocketsService.off('user:activity-indicator-updated', handleUserActivityIndicatorUpdated);
        websocketsService.off('user:updated', handleUserUpdated);
        websocketsService.off('user:unread-messages-updated', handleUserUnreadMessagesUpdated);
      }
    };

    handle();
  }, [userAuthenticated]);

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

  const trackScreensOpening = useCallback(() => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = rootNavigation.navigationRef.current.getCurrentRoute().name;

    if (previousRouteName !== currentRouteName) {
      analyticsService.logEvent({
        name: analyticsService.events.SCREEN_OPENED,
        data: {
          userType,
        },
      });
    }

    routeNameRef.current = currentRouteName;
  }, [userType]);

  const blockAccountIfNeeded = useCallback(async () => {
    if (userStatus && userStatus !== USER_STATUSES.BLOCKED) {
      try {
        const user = await dispatch(userActions.getUserData());
        if (user.status === USER_STATUSES.BLOCKED) {
          rootNavigation.resetToScreen('AppStack', 'AccountBlocked');
        }
      } catch (error) {
        console.log('blockAccountIfNeeded error', error);
        showFailure();
      }
    }
  }, [dispatch, showFailure, userStatus]);

  useEffect(() => {
    const checkIsAccountBlocked = (appState) => {
      if (appState === 'active' && userAuthenticated) {
        blockAccountIfNeeded();
      }
    };

    AppState.addEventListener('change', checkIsAccountBlocked);

    return () => {
      AppState.removeEventListener('change', checkIsAccountBlocked);
    };
  }, [blockAccountIfNeeded, userAuthenticated]);

  return (
    <ToastProvider placement="top" offset={30}>
      <NavigationContainer
        theme={NAVIGATOR_CONTAINER_THEME}
        ref={rootNavigation.navigationRef}
        onReady={onNavigatorReady}
        linking={linking}
        onStateChange={trackScreensOpening}
      >
        <OfflineBanner />

        <Stack.Navigator initialRouteName={userAuthenticated ? 'AppStack' : 'AuthStack'} headerMode="none">
          <Stack.Screen name="AppStack" component={AppScreens} />
          <Stack.Screen name="AuthStack" component={AuthScreens} />
        </Stack.Navigator>
      </NavigationContainer>
    </ToastProvider>
  );
}

export default AppNavigation;
