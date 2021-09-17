import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Fights from 'screens/Fights';
import Events from 'screens/Events';
import NewPost from 'screens/NewPost';
import SearchFighters from 'screens/SearchFighters';
import Account from 'screens/Account';

import EventsIcon from 'assets/icons/tab-bar/events.svg';
import NewPostIcon from 'assets/icons/tab-bar/new-post.svg';
import FightersIcon from 'assets/icons/tab-bar/fighters.svg';
import AccountIcon from 'assets/icons/tab-bar/account.svg';
import ActivityIcon from 'assets/icons/tab-bar/activity.svg';

import BottomTabBar from './BottomTabBar';

const Tab = createBottomTabNavigator();

function renderTabBar(props) {
  return <BottomTabBar {...props} />;
}

function FighterTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Account"
      tabBar={renderTabBar}
      lazy={false}
    >
      <Tab.Screen name="Fighters" component={SearchFighters} options={{ icon: FightersIcon }} />
      <Tab.Screen name="Events" component={Events} options={{ icon: EventsIcon }} />
      <Tab.Screen
        name="NewPost"
        component={NewPost}
        options={{ icon: NewPostIcon,
          tabBarVisible: false,
          hideLabel: true,
        }}
      />
      <Tab.Screen
        name="Activity"
        component={Fights} // TODO: Replace with activity page
        options={{ icon: ActivityIcon }}
      />
      <Tab.Screen name="Account" component={Account} options={{ icon: AccountIcon }} />
    </Tab.Navigator>
  );
}

export default React.memo(FighterTabNavigator);
