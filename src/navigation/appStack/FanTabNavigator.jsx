import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import FeedIcon from 'assets/icons/tab-bar/feed.svg';
import EventsIcon from 'assets/icons/tab-bar/events.svg';
import VotingIcon from 'assets/icons/tab-bar/voting.svg';
import AccountIcon from 'assets/icons/tab-bar/account.svg';
import ActivityIcon from 'assets/icons/tab-bar/activity.svg';
import UnreadActivityIcon from 'assets/icons/tab-bar/unread-activity.svg';


import Feed from 'screens/Feed';
import Events from 'screens/Events';
import Account from 'screens/Account';
import Voting from 'screens/Voting';
import Activity from 'screens/Activity';

import * as messageSelectors from 'resources/message/message.selectors';
import * as activitySelectors from 'resources/activity/activity.selectors';

import BottomTabBar from './BottomTabBar';

const Tab = createBottomTabNavigator();

function renderTabBar(props) {
  return <BottomTabBar {...props} />;
}

const optionsByScreen = {
  feed: { icon: FeedIcon },
  voting: { icon: VotingIcon },
  events: { icon: EventsIcon },
  account: { icon: AccountIcon },
};

function FanTabNavigator() {
  const isUnreadMessages = useSelector(messageSelectors.getIsUnreadMessages);
  const isUnreadActivities = useSelector(activitySelectors.getIsUnreadActivities);

  const activityIcon = (isUnreadActivities || isUnreadMessages)
    ? UnreadActivityIcon
    : ActivityIcon;

  const activityOptions = useMemo(() => ({ icon: activityIcon }), [activityIcon]);

  return (
    <Tab.Navigator
      initialRouteName="Feed"
      tabBar={renderTabBar}
      lazy={false}
    >
      <Tab.Screen name="Feed" options={optionsByScreen.feed} component={Feed} />
      <Tab.Screen
        name="Voting"
        options={optionsByScreen.voting}
        component={Voting}
      />
      <Tab.Screen name="Events" options={optionsByScreen.events} component={Events} />
      <Tab.Screen name="Activity" options={activityOptions} component={Activity} />
      <Tab.Screen name="Account" options={optionsByScreen.account} component={Account} />
    </Tab.Navigator>
  );
}

export default React.memo(FanTabNavigator);
