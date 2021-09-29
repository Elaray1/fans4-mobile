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

import BottomTabBar from './BottomTabBar';

const Tab = createBottomTabNavigator();

function renderTabBar(props) {
  return <BottomTabBar {...props} />;
}

function FanTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      tabBar={renderTabBar}
      lazy={false}
    >
      <Tab.Screen name="Feed" component={Feed} options={{ icon: FeedIcon }} />
      <Tab.Screen name="Voting" component={Voting} options={{ icon: VotingIcon }} />
      <Tab.Screen name="Events" component={Events} options={{ icon: EventsIcon }} />
      {/* TODO: replace Account component with Chats component */}
      <Tab.Screen name="Messages" component={Account} options={{ icon: MessageIcon }} />
      <Tab.Screen name="Account" component={Account} options={{ icon: AccountIcon }} />
    </Tab.Navigator>
  );
}

export default React.memo(FanTabNavigator);
