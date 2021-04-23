import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AccountIcon from 'assets/icons/tab-bar/account.svg';
import ExploreIcon from 'assets/icons/tab-bar/explore.svg';
import FightsIcon from 'assets/icons/tab-bar/fights.svg';
import NewPostIcon from 'assets/icons/tab-bar/new-post.svg';

import EmailConfirmation from 'screens/EmailConfirmation';
import Account from 'screens/Account';
import Explore from 'screens/Explore';
import Fights from 'screens/Fights';
import NewPost from 'screens/NewPost';
import BiographicalData from 'screens/BiographicalData';
import PersonalInfo from 'screens/PersonalInfo';
import TermsOfUse from 'screens/TermsOfUse';
import VerificationPending from 'screens/VerificationPending';
import VerificationSuccessful from 'screens/VerificationSuccessful';
import VerificationFailed from 'screens/VerificationFailed';
import OnBoarding1 from 'screens/OnBoarding1';
import OnBoarding2 from 'screens/OnBoarding2';
import OnBoarding3 from 'screens/OnBoarding3';
import ContactAdmin from 'screens/ContactAdmin';
import Support from 'screens/Support';

import colors from 'themes/colors';
import { commonStyles } from 'themes/commonStyles';

import TabBarIcon from 'components/TabBarIcon';

const AppStack = createStackNavigator();
const ExploreStack = createStackNavigator();
const FightsStack = createStackNavigator();
const NewPostStack = createStackNavigator();
const AccountStack = createStackNavigator();
const Tab = createBottomTabNavigator();

const SCREEN_OPTIONS = {
  cardStyle: {
    backgroundColor: colors.main,
  },
};

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
      <ExploreStack.Screen name="Explore" component={Explore} />
    </ExploreStack.Navigator>
  );
}

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

function Tabs() {
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
        name="Explore"
        component={ExploreScreens}
        options={{
          tabBarLabel: 'Explore',
          // eslint-disable-next-line react/prop-types
          tabBarIcon: ({ focused }) => <TabBarIcon icon={ExploreIcon} focused={focused} />,
        }}
      />
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
        name="NewPost"
        component={NewPostScreens}
        options={{
          tabBarLabel: 'New post',
          // eslint-disable-next-line react/prop-types
          tabBarIcon: ({ focused }) => <TabBarIcon icon={NewPostIcon} focused={focused} />,
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

function AppScreens() {
  return (
    <AppStack.Navigator
      headerMode="none"
      screenOptions={SCREEN_OPTIONS}
    >

      {/* <TABS> */}
      <AppStack.Screen name="Tabs" component={Tabs} />
      {/* <TABS /> */}

      { /* Screens without tabs */}
      <AppStack.Screen name="EmailConfirmation" component={EmailConfirmation} />
      <AppStack.Screen name="BiographicalData" component={BiographicalData} />
      <AppStack.Screen name="PersonalInfo" component={PersonalInfo} />
      <AppStack.Screen name="TermsOfUse" component={TermsOfUse} />
      <AppStack.Screen name="VerificationPending" component={VerificationPending} />
      <AppStack.Screen name="VerificationSuccessful" component={VerificationSuccessful} />
      <AppStack.Screen name="VerificationFailed" component={VerificationFailed} />
      <AppStack.Screen name="OnBoarding1" component={OnBoarding1} />
      <AppStack.Screen name="OnBoarding2" component={OnBoarding2} />
      <AppStack.Screen name="OnBoarding3" component={OnBoarding3} />
      <AppStack.Screen name="ContactAdmin" component={ContactAdmin} />
      <AppStack.Screen name="Support" component={Support} />
    </AppStack.Navigator>
  );
}

export default AppScreens;
