import React from 'react';
import { Platform, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PropTypes from 'prop-types';

import HomeIcon from 'assets/icons/tab-bar/home';

import EmailConfirmation from 'screens/EmailConfirmation';
import Home from 'screens/Home';
import BiographicalData from 'screens/BiographicalData';
import PersonalInfo from 'screens/PersonalInfo';
import TermsOfUse from 'screens/TermsOfUse';
import VerificationPending from 'screens/VerificationPending';
import VerificationSuccessful from 'screens/VerificationSuccessful';
import VerificationFailed from 'screens/VerificationFailed';
import OnBoarding1 from 'screens/OnBoarding1';
import OnBoarding2 from 'screens/OnBoarding2';
import OnBoarding3 from 'screens/OnBoarding3';

import colors from 'themes/colors';
import { commonStyles } from 'themes/commonStyles';

import TabBarIcon from 'components/TabBarIcon';

const AppStack = createStackNavigator();
const HomeStack = createStackNavigator();
const Tab = createBottomTabNavigator();

const SCREEN_OPTIONS = {
  cardStyle: {
    backgroundColor: colors.main,
  },
};

function HomeScreens() {
  return (
    <HomeStack.Navigator headerMode="none" screenOptions={SCREEN_OPTIONS}>
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
    <View style={commonStyles.navigator}>
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
      </AppStack.Navigator>
    </View>
  );
}

export default AppScreens;
