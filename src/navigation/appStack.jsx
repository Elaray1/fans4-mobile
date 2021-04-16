import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import * as RootNavigation from 'helpers/rootNavigation';

import * as userActions from 'resources/user/user.actions';

import HomeIcon from 'assets/icons/tab-bar/home.svg';

import AppLoader from 'screens/AppLoader/AppLoader';
import Home from 'screens/Home';
import BiographicalData from 'screens/BiographicalData';
import TermsOfUse from 'screens/TermsOfUse';
import VerificationPending from 'screens/VerificationPending';
import VerificationSuccessful from 'screens/VerificationSuccessful';
import VerificationFailed from 'screens/VerificationFailed';
import OnBoarding1 from 'screens/OnBoarding1';
import OnBoarding2 from 'screens/OnBoarding2';
import OnBoarding3 from 'screens/OnBoarding3';

import colors from 'themes/colors';
import { commonStyles } from 'themes/commonStyles';

import firebasePushNotificationService from 'services/firebase.pushNotification.service';
import localPushNotificationService from 'services/local.pushNotification.service';

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
  // Initialize Push Notifications
  useEffect(() => {
    const onRegister = async (pushNotificationToken) => {
      await userActions.setPushToken(pushNotificationToken);
    };

    const onNotification = (message) => {
      console.log('[App] onNotification: ', message);

      const options = {
        soundName: 'default',
        playSound: true,
      };

      if (message.notification) {
        localPushNotificationService.showNotification(
          Number(Math.random().toString().substr(2, 9)),
          message.notification.title,
          message.notification.body,
          message.data,
          options,
        );
      }
    };

    const onOpenNotification = async (message) => {
      console.log('[App] onOpenNotification: ', message);
    };

    (async () => {
      await firebasePushNotificationService.registerAppWithFCM();
      await firebasePushNotificationService.register(
        onRegister, onNotification, onOpenNotification,
      );
      localPushNotificationService.configure(onOpenNotification);
    })();

    return () => {
      firebasePushNotificationService.unregister();
      localPushNotificationService.unregister();
    };
  }, []);

  // Initial navigation
  useEffect(() => {
    RootNavigation.reset(({
      index: 0,
      routes: [
        {
          name: 'BiographicalData',
        },
      ],
    }));
  }, []);

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
      <AppStack.Screen name="BiographicalData" component={BiographicalData} />
      <AppStack.Screen name="TermsOfUse" component={TermsOfUse} />
      <AppStack.Screen name="VerificationPending" component={VerificationPending} />
      <AppStack.Screen name="VerificationSuccessful" component={VerificationSuccessful} />
      <AppStack.Screen name="VerificationFailed" component={VerificationFailed} />
      <AppStack.Screen name="OnBoarding1" component={OnBoarding1} />
      <AppStack.Screen name="OnBoarding2" component={OnBoarding2} />
      <AppStack.Screen name="OnBoarding3" component={OnBoarding3} />
    </AppStack.Navigator>
  );
}

export default AppScreens;
