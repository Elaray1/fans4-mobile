import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import pushNotificationService from 'services/pushNotification.service';
import * as rootNavigation from 'helpers/rootNavigation';
import { PUSH_NOTIFICATION_TYPES } from 'helpers/constants';

import * as userSelectors from 'resources/user/user.selectors';
import * as eventApi from 'resources/event/event.api';

const pushNotificationHandlersByType = {
  [PUSH_NOTIFICATION_TYPES.POST_STATUS_CHANGED]: () => {
    rootNavigation.push('AppStack', {
      screen: 'Tabs',
      params: { screen: 'Account' },
    });
  },
  [PUSH_NOTIFICATION_TYPES.FIGHTER_REGISTRATION_APPROVED]: () => {
    rootNavigation.push('VerificationSuccessful');
  },
  [PUSH_NOTIFICATION_TYPES.FIGHTER_REGISTRATION_DECLINED]: () => {
    rootNavigation.push('VerificationFailed');
  },
  [PUSH_NOTIFICATION_TYPES.STRIPE_PAYOUT_ACCOUNT_STATUS_CHANGED]: () => {
    rootNavigation.push('Finances');
  },
  [PUSH_NOTIFICATION_TYPES.NEW_SUBSCRIBER]: () => {
    rootNavigation.push('AppStack', {
      screen: 'Tabs',
      params: { screen: 'Activity' },
    });
  },
  [PUSH_NOTIFICATION_TYPES.FIGHTER_IN_FIGHT_VOTING]: ({ fight }) => {
    const parsedFight = JSON.parse(fight);

    rootNavigation.push('FighterVoting', { fight: parsedFight });
  },
  [PUSH_NOTIFICATION_TYPES.FAN_PROPOSED_FIGHT_IN_VOTING]: ({ fight }) => {
    const parsedFight = JSON.parse(fight);
    rootNavigation.push('AppStack', {
      screen: 'Tabs',
      params: { screen: 'Voting', params: { fight: parsedFight } },
    });
  },
  [PUSH_NOTIFICATION_TYPES.FAN_PROPOSED_FIGHT_IN_UPCOMING_EVENT]: ({ event }) => {
    const parsedEvent = JSON.parse(event);

    rootNavigation.push('EventFights', { event: parsedEvent });
  },
  [PUSH_NOTIFICATION_TYPES.FAN_VOTED_FIGHT_IN_UPCOMING_EVENT]: ({ event }) => {
    const parsedEvent = JSON.parse(event);

    rootNavigation.push('EventFights', { event: parsedEvent });
  },
  [PUSH_NOTIFICATION_TYPES.EVENT_PUBLISHED]: ({ event }) => {
    const parsedEvent = JSON.parse(event);

    rootNavigation.push('EventFights', { event: parsedEvent });
  },
  [PUSH_NOTIFICATION_TYPES.EVENT_CANCELLED]: ({ event }) => {
    const parsedEvent = JSON.parse(event);

    rootNavigation.push('EventFights', { event: parsedEvent });
  },
  [PUSH_NOTIFICATION_TYPES.EVENT_POSTPONED]: ({ event }) => {
    const parsedEvent = JSON.parse(event);

    rootNavigation.push('EventFights', { event: parsedEvent });
  },
  [PUSH_NOTIFICATION_TYPES.FIGHTER_IN_EVENT_FIGHT]: ({ event }) => {
    const parsedEvent = JSON.parse(event);

    rootNavigation.push('EventFights', { event: parsedEvent });
  },
  [PUSH_NOTIFICATION_TYPES.NEW_EVENT_FIGHT_ADDED]: ({ event }) => {
    const parsedEvent = JSON.parse(event);

    rootNavigation.push('EventFights', { event: parsedEvent });
  },
  [PUSH_NOTIFICATION_TYPES.NEW_EVENT_FIGHTS_ADDED]: ({ event }) => {
    const parsedEvent = JSON.parse(event);

    rootNavigation.push('EventFights', { event: parsedEvent });
  },
  [PUSH_NOTIFICATION_TYPES.LIVE_EVENT_STARTED]: async ({ event }) => {
    const parsedEvent = JSON.parse(event);
    const updatedEvent = await eventApi.getEvent(parsedEvent._id);

    rootNavigation.push('EventFights', { event: updatedEvent, isOpenStreamModal: true });
  },
  [PUSH_NOTIFICATION_TYPES.BEFORE_LIVE_EVENT]: ({ event }) => {
    const parsedEvent = JSON.parse(event);

    rootNavigation.push('EventFights', { event: parsedEvent, isOpenSubscribeModal: true });
  },
  [PUSH_NOTIFICATION_TYPES.NEW_MESSAGE]: ({ chat, userId }) => {
    const parsedChat = JSON.parse(chat);

    const otherUser = parsedChat.participants.find(p => p._id !== userId);

    rootNavigation.push('Chat', {
      userId: otherUser._id,
      userFullName: otherUser.name,
      userAvatar: otherUser.avatarUrl,
      chatId: parsedChat._id,
      isFromNotification: true,
      closingReason: parsedChat.closingReason,
    });
  },
  [PUSH_NOTIFICATION_TYPES.NEW_POST]: ({ post }) => {
    const parsedPost = JSON.parse(post);
    rootNavigation.push('AppStack', {
      screen: 'Tabs',
      params: { screen: 'Feed', params: { post: parsedPost } },
    });
  },
};

const useNotifications = () => {
  const userAuthenticated = useSelector(userSelectors.getAuthenticated);

  useEffect(() => {
    const handle = async () => {
      if (userAuthenticated) {
        pushNotificationService.startNotificationHandling(pushNotificationHandlersByType);
      } else {
        pushNotificationService.stopNotificationHandling();
      }
    };

    handle();
  }, [userAuthenticated]);
};

export default useNotifications;
