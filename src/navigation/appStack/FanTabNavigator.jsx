import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import FeedIcon from 'assets/icons/tab-bar/feed.svg';
import MessageIcon from 'assets/icons/tab-bar/message.svg';
import EventsIcon from 'assets/icons/tab-bar/events.svg';
import VotingIcon from 'assets/icons/tab-bar/voting.svg';
import AccountIcon from 'assets/icons/tab-bar/account.svg';

import Feed from 'screens/Feed';
import Events from 'screens/Events';
import Voting from 'screens/Voting';
import Account from 'screens/Account';
import ChatsList from 'screens/ChatsList';

import config from 'resources/config';

import BottomTabBar from './BottomTabBar';

const Tab = createBottomTabNavigator();

function renderTabBar(props) {
  return <BottomTabBar {...props} />;
}

const optionsByScreen = {
  feed: { icon: FeedIcon },
  voting: { icon: VotingIcon },
  events: { icon: EventsIcon },
  message: { icon: MessageIcon },
  account: { icon: AccountIcon },
};

function FanTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      tabBar={renderTabBar}
      lazy={false}
    >
      <Tab.Screen name="Feed" component={Feed} options={optionsByScreen.feed} />
      <Tab.Screen name="Voting" component={Voting} options={optionsByScreen.voting} />
      <Tab.Screen name="Events" component={Events} options={optionsByScreen.events} />
      {/* TODO: replace Account component with Chats component */}
      {config.mode !== 'PROD'
      && <Tab.Screen name="Messages" component={ChatsList} options={optionsByScreen.message} />}
      <Tab.Screen name="Account" component={Account} options={optionsByScreen.account} />
    </Tab.Navigator>
  );
}

export default React.memo(FanTabNavigator);
