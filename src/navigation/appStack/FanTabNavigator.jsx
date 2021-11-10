import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import FeedIcon from 'assets/icons/tab-bar/feed.svg';
import MessageIcon from 'assets/icons/tab-bar/message.svg';
import UnreadMessageIcon from 'assets/icons/tab-bar/unread-message.svg';
import EventsIcon from 'assets/icons/tab-bar/events.svg';
import VotingIcon from 'assets/icons/tab-bar/voting.svg';
import AccountIcon from 'assets/icons/tab-bar/account.svg';

import Feed from 'screens/Feed';
import Events from 'screens/Events';
import Account from 'screens/Account';
import ChatsList from 'screens/ChatsList';
import NewVoting from 'screens/NewVoting';
import Voting from 'screens/Voting';

import ScrollToTop from 'components/ScrollToTop';

import * as messageSelectors from 'resources/message/message.selectors';

import config from 'resources/config';

import BottomTabBar from './BottomTabBar';

const Tab = createBottomTabNavigator();

function renderTabBar(props) {
  return <BottomTabBar {...props} />;
}

const scrollToTopWrapper = (children) => {
  return <ScrollToTop>{children}</ScrollToTop>;
};

const optionsByScreen = {
  feed: { icon: FeedIcon },
  voting: { icon: VotingIcon },
  events: { icon: EventsIcon },
  account: { icon: AccountIcon },
};

function FanTabNavigator() {
  const isUnreadMessages = useSelector(messageSelectors.getIsUnreadMessages);

  const chatsIcon = isUnreadMessages ? UnreadMessageIcon : MessageIcon;

  const chatsOptions = useMemo(() => ({ icon: chatsIcon }), [chatsIcon]);
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      tabBar={renderTabBar}
      lazy={false}
    >
      <Tab.Screen name="Feed" options={optionsByScreen.feed}>
        {() => scrollToTopWrapper(<Feed />)}
      </Tab.Screen>
      <Tab.Screen
        name="Voting"
        options={optionsByScreen.voting}
      >
        {() => scrollToTopWrapper(config.mode === 'PROD'
          ? <NewVoting /> : <Voting />)}
      </Tab.Screen>
      <Tab.Screen name="Events" options={optionsByScreen.events}>
        {() => scrollToTopWrapper(<Events />)}
      </Tab.Screen>
      {/* TODO: replace Account component with Chats component */}
      {config.mode !== 'PROD'
      && (
      <Tab.Screen name="Chats" options={chatsOptions}>
        {() => scrollToTopWrapper(<ChatsList />)}
      </Tab.Screen>
      )}
      <Tab.Screen name="Account" options={optionsByScreen.account}>
        {() => scrollToTopWrapper(<Account />)}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default React.memo(FanTabNavigator);
