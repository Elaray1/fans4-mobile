import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';

import EmailConfirmation from 'screens/EmailConfirmation';
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
import ChangeBiography from 'screens/ChangeBiography';
import ChangeFanInfo from 'screens/ChangeFanInfo';
import AccountInformation from 'screens/AccountInformation';
import AccountBlocked from 'screens/AccountBlocked';
import Security from 'screens/Security';
import PasswordUpdated from 'screens/PasswordUpdated';
import ChangePassword from 'screens/ChangePassword';
import ChangeEmail from 'screens/ChangeEmail';
import ConfirmYourEmailAddress from 'screens/ConfirmYourEmailAddress';
import Fans from 'screens/Fans';
import Fighter from 'screens/Fighter';
import InviteAFan from 'screens/InviteAFan';
import EventFights from 'screens/EventFights';
import Comments from 'screens/Comments';
import ReportComment from 'screens/ReportComment';
import ThanksForReporting from 'screens/ThanksForReporting';
import Finances from 'screens/Finances';
import ProposeAFight from 'screens/ProposeAFight';
import LegalInformation from 'screens/LegalInformation';
import SettingsTermsOfUse from 'screens/SettingsTermsOfUse';
import SettingsPrivacyPolicy from 'screens/SettingsPrivacyPolicy';
import BankAccountAdded from 'screens/BankAccountAdded';
import Fans4Profile from 'screens/Fans4Profile';

import * as userSelectors from 'resources/user/user.selectors';
import { USER_TYPES } from 'resources/user/user.constants';

import colors from 'themes/colors';

import FighterTabNavigator from './FighterTabNavigator';
import FanTabNavigator from './FanTabNavigator';


const AppStack = createStackNavigator();

const SCREEN_OPTIONS = {
  cardStyle: {
    backgroundColor: colors.main,
  },
};

function Tabs() {
  const userType = useSelector(userSelectors.getUserType);

  return (
    userType === USER_TYPES.FIGHTER ? <FighterTabNavigator /> : <FanTabNavigator />
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
      <AppStack.Screen name="ChangeBiography" component={ChangeBiography} />
      <AppStack.Screen name="ChangeFanInfo" component={ChangeFanInfo} />
      <AppStack.Screen name="AccountInformation" component={AccountInformation} />
      <AppStack.Screen name="AccountBlocked" component={AccountBlocked} />
      <AppStack.Screen name="Security" component={Security} />
      <AppStack.Screen name="PasswordUpdated" component={PasswordUpdated} />
      <AppStack.Screen name="ChangePassword" component={ChangePassword} />
      <AppStack.Screen name="ChangeEmail" component={ChangeEmail} />
      <AppStack.Screen name="ConfirmYourEmailAddress" component={ConfirmYourEmailAddress} />
      <AppStack.Screen name="Fans" component={Fans} />
      <AppStack.Screen name="Fighter" component={Fighter} />
      <AppStack.Screen name="InviteAFan" component={InviteAFan} />
      <AppStack.Screen name="EventFights" component={EventFights} />
      <AppStack.Screen name="Comments" component={Comments} />
      <AppStack.Screen name="ReportComment" component={ReportComment} />
      <AppStack.Screen name="ThanksForReporting" component={ThanksForReporting} />
      <AppStack.Screen name="Finances" component={Finances} />
      <AppStack.Screen name="ProposeAFight" component={ProposeAFight} />
      <AppStack.Screen name="LegalInformation" component={LegalInformation} />
      <AppStack.Screen name="SettingsPrivacyPolicy" component={SettingsPrivacyPolicy} />
      <AppStack.Screen name="SettingsTermsOfUse" component={SettingsTermsOfUse} />
      <AppStack.Screen name="BankAccountAdded" component={BankAccountAdded} />
      <AppStack.Screen name="Fans4Profile" component={Fans4Profile} />
    </AppStack.Navigator>
  );
}

export default AppScreens;
