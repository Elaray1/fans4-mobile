import React, { useState, useCallback, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import * as socketService from 'services/socket.service';

import * as userActions from 'resources/user/user.actions';
import * as userSelectors from 'resources/user/user.selectors';

import colors from 'themes/colors';

import Logo from 'assets/icons/logo';
import Checkmark from 'assets/icons/checkmark';

import Text from 'components/Text';
import Button from 'components/Button';

import styles from './EmailConfirmation.styles';

function EmailConfirmation() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const userEmail = useSelector(userSelectors.getUserEmail);
  const userType = useSelector(userSelectors.getUserType);

  let timer = null;

  const [isResendButtonShown, setIsResendButtonShown] = useState(false);

  useEffect(() => {
    socketService.on('email:verified', async (updatedUser) => {
      await dispatch(userActions.setUserData(updatedUser));
      navigation.navigate('BiographicalData');
    });
  }, [dispatch, navigation]);

  useEffect(() => {
    timer = setTimeout(() => setIsResendButtonShown(true), 10000);
    return () => timer && clearTimeout(timer);
  }, [timer]);

  const onResendEmail = useCallback(async () => {
    setIsResendButtonShown(false);
    timer = setTimeout(() => setIsResendButtonShown(true), 10000);

    await userActions.sendEmailConfirmation({ email: userEmail });
  }, [userEmail]);

  const goToSignUp = useCallback(async () => {
    await dispatch(userActions.logout());
    navigation.replace('AuthStack', { screen: 'SignUp', params: { userType } });
  }, [dispatch, navigation, userType]);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View>
          <Logo style={styles.logo} />
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
