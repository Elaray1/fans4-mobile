import React from 'react';
import { useSelector } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import EventsIcon from 'assets/icons/tab-bar/events.svg';
import NewPostIcon from 'assets/icons/tab-bar/new-post.svg';
import FightersIcon from 'assets/icons/tab-bar/fighters.svg';
import AccountIcon from 'assets/icons/tab-bar/account.svg';
import ActivityIcon from 'assets/icons/tab-bar/activity.svg';
import UnreadActivityIcon from 'assets/icons/tab-bar/unread-activity.svg';

import Events from 'screens/Events';
import NewPost from 'screens/NewPost';
import SearchFighters from 'screens/SearchFighters';
import Account from 'screens/Account';
import Activity from 'screens/Activity';

import * as userSelectors from 'resources/user/user.selectors';
import * as messageSelectors from 'resources/message/message.selectors';

import BottomTabBar from './BottomTabBar';

const Tab = createBottomTabNavigator();

function renderTabBar(props) {
  return <BottomTabBar {...props} />;
}

function FighterTabNavigator() {
  const isUnreadActivities = useSelector(userSelectors.getUserActivityIndicator);
  const userId = useSelector(userSelectors.getUserId);
  const isUnreadMessages = useSelector(messageSelectors.getIsUnreadMessages);
  const isFans4 = userId === 'fans4';

  const activityIcon = ((isUnreadActivities || isUnreadMessages) && !isFans4)
    ? UnreadActivityIcon
    : ActivityIcon;

  return (
    <Tab.Navigator
      initialRouteName="Account"
      tabBar={renderTabBar}
      lazy={false}
    >
      <Tab.Screen name="Fighters" options={{ icon: FightersIcon }} component={SearchFighters} />
      <Tab.Screen name="Events" options={{ icon: EventsIcon }} component={Events} />
      <Tab.Screen
        name="NewPost"
        component={NewPost}
        options={{ icon: NewPostIcon,
          tabBarVisible: false,
          hideLabel: true,
        }}
      />
      <Tab.Screen name="Activity" options={{ icon: activityIcon }} component={Activity} />
      <Tab.Screen name="Account" options={{ icon: AccountIcon }} component={Account} />
    </Tab.Navigator>
  );
}

export default React.memo(FighterTabNavigator);
