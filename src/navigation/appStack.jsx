import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeIcon from 'assets/icons/tab-bar/home.svg';

import AppLoader from 'screens/AppLoader/AppLoader';
import Home from 'screens/Home';
import PersonalInfo from 'screens/PersonalInfo';

import colors from 'themes/colors';
import commonStyles from 'themes/commonStyles';

import TabBarIcon from 'components/TabBarIcon';

const AppStack = createStackNavigator();
const HomeStack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeScreens() {
  return (
    <HomeStack.Navigator
      headerMode="none"
      screenOptions={{
        cardStyle: {
          backgroundColor: colors.main,
        },
      }}
    >
      <HomeStack.Screen name="Home" component={Home} />
    </HomeStack.Navigator>
  );
}

function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
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
        name="Home"
        component={HomeScreens}
        options={{
          tabBarLabel: 'Home',
          // eslint-disable-next-line react/prop-types
          tabBarIcon: ({ focused }) => <TabBarIcon icon={HomeIcon} focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

function AppScreens() {
  return (
    <AppStack.Navigator
      headerMode="none"
      screenOptions={{
        cardStyle: {
          backgroundColor: colors.main,
        },
      }}
      initialRouteName="AppLoader"
    >
      <AppStack.Screen name="AppLoader" component={AppLoader} />

      {/* <TABS> */}
      <AppStack.Screen name="Tabs" component={Tabs} />
      {/* <TABS /> */}

      { /* Screens without tabs */}
      <AppStack.Screen name="PersonalInfo" component={PersonalInfo} />

    </AppStack.Navigator>
  );
}

export default AppScreens;
