import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView, View, StatusBar, ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import * as userActions from 'resources/user/user.actions';

import colors from 'themes/colors';

import Logo from 'assets/icons/logo';
import Checkmark from 'assets/icons/checkmark';

import Text from 'components/Text';
import Button from 'components/Button';

import { setItem, removeItem } from 'helpers/storage';
import { USER_TYPES } from 'resources/user/user.constants';
import { STORAGE_KEYS } from 'helpers/constants';

import styles from './EmailConfirmation.styles';

function EmailConfirmation({ route }) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { email, userType, isResendEmail } = route.params;

  let timer = null;

  const [isResendButton, setIsResendButton] = useState(isResendEmail);

  useEffect(() => {
    const init = async () => {
      await Promise.all([
        setItem(STORAGE_KEYS.PREV_SCREEN, 'EmailConfirmation'),
        setItem(STORAGE_KEYS.USER_TYPE, userType),
        setItem(STORAGE_KEYS.USER_EMAIL, email),
      ]);
    };

    init();
  }, [userType, email]);

  useEffect(() => {
    if (!isResendEmail) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      timer = setTimeout(() => setIsResendButton(true), 10000);
    }

    return () => timer && clearTimeout(timer);
  }, [isResendEmail]);

  const onResendEmail = useCallback(async () => {
    setIsResendButton(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    timer = setTimeout(() => setIsResendButton(true), 10000);

    await userActions.sendEmailConfirmation({ email });
  }, [email]);

  const onBackToSignUp = useCallback(async () => {
    await Promise.all([
      removeItem(STORAGE_KEYS.PREV_SCREEN),
      removeItem(STORAGE_KEYS.USER_TYPE),
      removeItem(STORAGE_KEYS.USER_EMAIL),
    ]);

    navigation.reset({
      index: 1,
      routes: [
        {
          name: 'SelectUserType',
        },
        {
          name: 'SignUp',
          params: {
            userType,
          },
        },
      ],
    });
  }, [navigation, userType]);

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
              {email}
              .
            </Text>
            <Text style={[styles.text, { marginTop: 20 }]}>
              {t('EmailConfirmation.PleaseCheckYourInbox')}
              .
            </Text>
          </View>
        </View>
        <View>
          {isResendButton
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
            onPress={onBackToSignUp}
            type="link"
            style={styles.linkButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

EmailConfirmation.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      email: PropTypes.string,
      userType: PropTypes.oneOf(Object.values(USER_TYPES)),
      isResendEmail: PropTypes.bool,
    }),
  }).isRequired,
};

export default EmailConfirmation;
