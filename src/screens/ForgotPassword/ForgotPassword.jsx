import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView, View, ScrollView, StatusBar,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import colors from 'themes/colors';

import Header from 'components/Header';
import Input from 'components/Input';
import Text from 'components/Text';
import Button from 'components/Button';

import * as userApi from 'resources/user/user.api';

import { validateEmail } from 'helpers/validate';

import { USER_TYPES } from 'resources/user/user.constants';

import useToast from 'hooks/useToast';

import styles from './ForgotPassword.styles';

function ForgotPassword({ route }) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { showFailure } = useToast();

  const { userType, email: initialEmail } = route.params;

  const [email, setEmail] = useState(initialEmail || '');
  const [isLoading, setIsLoading] = useState(false);

  const [isInputFocused, setIsInputFocused] = useState(!initialEmail);

  const onInputFocus = useCallback(() => {
    setIsInputFocused(true);
  }, []);

  const onInputBlur = useCallback(() => {
    setIsInputFocused(false);
  }, []);

  const onButtonPress = useCallback(async () => {
    setIsLoading(true);

    try {
      await userApi.sendResetPasswordEmail({ email, userType });
      navigation.navigate('ResetPasswordLink', { email, userType });
    } catch (error) {
      console.error(error);
      showFailure();
    }

    setIsLoading(false);
  }, [email, navigation, userType, showFailure]);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />
      <Header leftItemType="backArrow" title={t('ForgotPassword.title')} />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.text}>{t('ForgotPassword.text')}</Text>
            <Input
              label={t('ForgotPassword.inputLabel')}
              value={email}
              onChange={setEmail}
              autoCapitalize="none"
              autoFocus={isInputFocused}
              onFocus={onInputFocus}
              onBlur={onInputBlur}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title={t('ForgotPassword.button')}
              onPress={onButtonPress}
              disabled={!validateEmail(email) || isLoading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

ForgotPassword.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      userType: PropTypes.oneOf(Object.values(USER_TYPES)),
      email: PropTypes.string,
    }),
  }).isRequired,
};

export default ForgotPassword;
