import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AccountIcon from 'assets/icons/tab-bar/account.svg';
import ExploreIcon from 'assets/icons/tab-bar/explore.svg';
import FightsIcon from 'assets/icons/tab-bar/fights.svg';
import NewPostIcon from 'assets/icons/tab-bar/new-post.svg';
import EventsIcon from 'assets/icons/tab-bar/events.svg';

import Fights from 'screens/Fights';
import Events from 'screens/Events';
import Account from 'screens/Account';
import NewPost from 'screens/NewPost';
import SearchFighters from 'screens/SearchFighters';

import colors from 'themes/colors';
import { commonStyles } from 'themes/commonStyles';

import TabBarIcon from 'components/TabBarIcon';

const Tab = createBottomTabNavigator();

const FightsStack = createStackNavigator();
const ExploreStack = createStackNavigator();
const NewPostStack = createStackNavigator();
const AccountStack = createStackNavigator();
const EventsStack = createStackNavigator();

const SCREEN_OPTIONS = {
  cardStyle: {
    backgroundColor: colors.main,
  },
};

function FightsScreens() {
  return (
    <FightsStack.Navigator
      headerMode="none"
      screenOptions={SCREEN_OPTIONS}
    >
      <FightsStack.Screen name="Fights" component={Fights} />
    </FightsStack.Navigator>
  );
}

function EventsScreens() {
  return (
    <EventsStack.Navigator
      headerMode="none"
      screenOptions={SCREEN_OPTIONS}
    >
      <EventsStack.Screen name="Events" component={Events} />
    </EventsStack.Navigator>
  );
}

function NewPostScreens() {
  return (
    <NewPostStack.Navigator
      headerMode="none"
      screenOptions={SCREEN_OPTIONS}
    >
      <NewPostStack.Screen name="NewPost" component={NewPost} />
    </NewPostStack.Navigator>
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

function ExploreScreens() {
  return (
    <ExploreStack.Navigator
      headerMode="none"
      screenOptions={SCREEN_OPTIONS}
    >
      <ExploreStack.Screen name="SearchFighters" component={SearchFighters} />
    </ExploreStack.Navigator>
  );
}


function FighterNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Account"
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
        name="Fights"
        component={FightsScreens}
        options={{
          tabBarLabel: 'Fights',
          // eslint-disable-next-line react/prop-types
          tabBarIcon: ({ focused }) => <TabBarIcon icon={FightsIcon} focused={focused} />,
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
        name="NewPost"
        component={NewPostScreens}
        options={{
          tabBarLabel: 'New post',
          tabBarVisible: false,
          // eslint-disable-next-line react/prop-types
          tabBarIcon: ({ focused }) => <TabBarIcon icon={NewPostIcon} focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreens}
        options={{
          tabBarLabel: 'Explore',
          // eslint-disable-next-line react/prop-types
          tabBarIcon: ({ focused }) => <TabBarIcon icon={ExploreIcon} focused={focused} />,
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

export default React.memo(FighterNavigator);
