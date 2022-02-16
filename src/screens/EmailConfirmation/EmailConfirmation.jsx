import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  ScrollView,
  AppState,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useIsFocused } from '@react-navigation/native';

import websocketsService from 'services/socket.service';

import * as userActions from 'resources/user/user.actions';
import * as userSelectors from 'resources/user/user.selectors';
import * as userApi from 'resources/user/user.api';
import { USER_TYPES } from 'resources/user/user.constants';

import colors from 'themes/colors';

import LogoAsset from 'assets/logo.svg';
import Checkmark from 'assets/icons/checkmark';

import Text from 'components/Text';
import Button from 'components/Button';

import styles from './EmailConfirmation.styles';

function EmailConfirmation() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const userEmail = useSelector(userSelectors.getUserEmail);
  const userType = useSelector(userSelectors.getUserType);

  const [isResendButtonShown, setIsResendButtonShown] = useState(false);

  const checkEmailIntervalTimerRef = useRef();

  useEffect(() => {
    websocketsService.on('email:verified', async (updatedUser) => {
      await dispatch(userActions.setUserData(updatedUser));
      navigation.navigate(userType === USER_TYPES.FIGHTER ? 'BiographicalData' : 'WelcomeForm');
    });
  }, [dispatch, navigation, userType]);

  const checkIfConfirmed = useCallback(async () => {
    let updatedUser;

    try {
      updatedUser = await userApi.getUserData();
    } catch (err) {
      console.error('updating user data error', err);
    }

    if (updatedUser && updatedUser.appState.isEmailVerified) {
      dispatch(userActions.setUserData(updatedUser));
      navigation.navigate(userType === USER_TYPES.FIGHTER ? 'BiographicalData' : 'WelcomeForm');

      clearInterval(checkEmailIntervalTimerRef.current);
    }
  }, [navigation, dispatch, userType]);

  useEffect(() => {
    checkEmailIntervalTimerRef.current = setInterval(checkIfConfirmed, 3000);
    return () => checkEmailIntervalTimerRef.current && clearInterval(checkEmailIntervalTimerRef.current);
  }, [checkIfConfirmed]);

  useEffect(() => {
    const checkEmailVerificationOnFocus = async (appState) => {
      if (isFocused && appState === 'active') {
        await checkIfConfirmed();
      }
    };

    AppState.addEventListener('change', checkEmailVerificationOnFocus);

    return () => {
      AppState.removeEventListener('change', checkEmailVerificationOnFocus);
    };
  }, [isFocused, navigation, checkIfConfirmed]);

  useEffect(() => {
    const timer = setTimeout(() => setIsResendButtonShown(true), 10000);
    return () => timer && clearTimeout(timer);
  }, []);

  const onResendEmail = useCallback(async () => {
    setIsResendButtonShown(false);
    setTimeout(() => setIsResendButtonShown(true), 10000);

    await userActions.sendEmailConfirmation({
      email: userEmail,
      userType,
    });
  }, [userEmail, userType]);

  const goToSignUp = useCallback(async () => {
    await dispatch(userActions.logout());
    navigation.replace('AuthStack', { screen: 'SignUp', params: { userType } });
  }, [dispatch, navigation, userType]);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          <LogoAsset style={styles.logo} />
          <Text style={styles.title}>
            {t('EmailConfirmation.ConfirmYourEmailAddress')}
          </Text>
          <View>
            <Text style={styles.text}>
              {t('EmailConfirmation.WeHaveSentYouConfirmationEmailTo')}
              {' '}
              {userEmail}
              .
            </Text>
            <Text style={[styles.text, { marginTop: 20 }]}>
              {t('EmailConfirmation.PleaseCheckYourInbox')}
              .
            </Text>
          </View>
        </View>
        <View>
          {isResendButtonShown
            ? (
              <Button
                title={t('EmailConfirmation.ResendConfirmationEmail')}
                onPress={onResendEmail}
              />
            )
            : (
              <View style={styles.emailSent}>
                <View style={styles.checkmarkBox}><Checkmark /></View>
                <Text style={styles.emailSentText}>{t('EmailConfirmation.EmailHasBeenSent')}</Text>
              </View>
            )}
          <Button
            title={t('EmailConfirmation.BackToSignUpPage')}
            onPress={goToSignUp}
            type="link"
            style={styles.linkButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default React.memo(EmailConfirmation);
