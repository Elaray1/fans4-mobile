import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import * as rootNavigation from 'helpers/rootNavigation';
import store from 'store';

import websocketsService from 'services/socket.service';
import * as messageActions from 'resources/message/message.actions';
import { USER_STATUSES } from 'resources/user/user.constants';
import * as userActions from 'resources/user/user.actions';
import * as userSelectors from 'resources/user/user.selectors';

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

const handleUserUnreadMessagesUpdated = ({ messageId }) => {
  store.dispatch(messageActions.addUnreadMessage(messageId));
};

const useWebsockets = () => {
  const userAuthenticated = useSelector(userSelectors.getAuthenticated);

  useEffect(() => {
    const handle = async () => {
      if (userAuthenticated) {
        websocketsService.on('user:status-updated', handleUserStatusUpdated);
        websocketsService.on('fighter:updated', handleFighterUpdated);
        websocketsService.on('user:updated', handleUserUpdated);
        websocketsService.on('user:unread-messages-updated', handleUserUnreadMessagesUpdated);
      } else {
        websocketsService.off('user:status-updated', handleUserStatusUpdated);
        websocketsService.off('fighter:updated', handleFighterUpdated);
        websocketsService.off('user:updated', handleUserUpdated);
        websocketsService.off('user:unread-messages-updated', handleUserUnreadMessagesUpdated);
      }
    };

    handle();
  }, [userAuthenticated]);
};

export default useWebsockets;
