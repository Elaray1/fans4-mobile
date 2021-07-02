import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AccountIcon from 'assets/icons/tab-bar/account.svg';
import FightersIcon from 'assets/icons/tab-bar/fighters.svg';
import FeedIcon from 'assets/icons/tab-bar/feed.svg';
import EventsIcon from 'assets/icons/tab-bar/events.svg';
import VotingIcon from 'assets/icons/tab-bar/voting.svg';

import Feed from 'screens/Feed';
import Voting from 'screens/Voting';
import Account from 'screens/Account';
import SearchFighters from 'screens/SearchFighters';

import colors from 'themes/colors';
import { commonStyles } from 'themes/commonStyles';

import TabBarIcon from 'components/TabBarIcon';

const Tab = createBottomTabNavigator();

const FightersStack = createStackNavigator();
const AccountStack = createStackNavigator();
const FeedStack = createStackNavigator();
const EventsStack = createStackNavigator();
const VotingStack = createStackNavigator();

const SCREEN_OPTIONS = {
  cardStyle: {
    backgroundColor: colors.main,
  },
};

function FeedScreens() {
  return (
    <FeedStack.Navigator
      headerMode="none"
      screenOptions={SCREEN_OPTIONS}
    >
      <FeedStack.Screen name="Feed" component={Feed} />
    </FeedStack.Navigator>
  );
}

function EventsScreens() {
  return (
    <EventsStack.Navigator
      headerMode="none"
      screenOptions={SCREEN_OPTIONS}
    >
      {/* TODO: change on correct screen */}
      <EventsStack.Screen name="Feed" component={Feed} />
    </EventsStack.Navigator>
  );
}

function AccountScreens() {
  return (
    <AccountStack.Navigator
      headerMode="none"
      screenOptions={SCREEN_OPTIONS}
    >
      <AccountStack.Screen name="Account" component={Account} />
    </AccountStack.Navigator>
  );
}

function FightersScreens() {
  return (
    <FightersStack.Navigator
      headerMode="none"
      screenOptions={SCREEN_OPTIONS}
    >
      <FightersStack.Screen name="SearchFighters" component={SearchFighters} />
    </FightersStack.Navigator>
  );
}

function VotingScreens() {
  return (
    <VotingStack.Navigator
      headerMode="none"
      screenOptions={SCREEN_OPTIONS}
    >
      <VotingStack.Screen name="Voting" component={Voting} />
    </VotingStack.Navigator>
  );
}


function FanNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      tabBarOptions={{
        keyboardHidesTabBar: Platform.OS === 'android',
        activeTintColor: colors.tabBarActive,
        inactiveTintColor: colors.tabBarInactive,
        style: commonStyles.tabBar,
        tabStyle: commonStyles.tab,
        labelStyle: commonStyles.labelStyle,
      }}
    >
      <Tab.Screen
        name="Feed"
        component={FeedScreens}
        options={{
          tabBarLabel: 'Feed',
          // eslint-disable-next-line react/prop-types
          tabBarIcon: ({ focused }) => <TabBarIcon icon={FeedIcon} focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Fighters"
        component={FightersScreens}
        options={{
          tabBarLabel: 'Fighters',
          // eslint-disable-next-line react/prop-types
          tabBarIcon: ({ focused }) => <TabBarIcon icon={FightersIcon} focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Events"
        component={EventsScreens}
        options={{
          tabBarLabel: 'Events',
          // eslint-disable-next-line react/prop-types
          tabBarIcon: ({ focused }) => <TabBarIcon icon={EventsIcon} focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Voting"
        component={VotingScreens}
        options={{
          tabBarLabel: 'Voting',
          // eslint-disable-next-line react/prop-types
          tabBarIcon: ({ focused }) => <TabBarIcon icon={VotingIcon} focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreens}
        options={{
          tabBarLabel: 'Account',
          // eslint-disable-next-line react/prop-types
          tabBarIcon: ({ focused }) => <TabBarIcon icon={AccountIcon} focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default React.memo(FanNavigator);
