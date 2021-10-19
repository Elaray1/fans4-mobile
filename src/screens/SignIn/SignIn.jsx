import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView, View, StatusBar, ScrollView, KeyboardAvoidingView, TouchableOpacity, Linking,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import colors from 'themes/colors';

import LogoAsset from 'assets/logo.svg';
import ErrorIcon from 'assets/icons/error';
import BackArrowIcon from 'assets/icons/back-arrow';

import Text from 'components/Text';
import Button from 'components/Button';
import Input from 'components/Input';

import config from 'resources/config';
import { USER_TYPES } from 'resources/user/user.constants';

import * as userActions from 'resources/user/user.actions';
import * as userApi from 'resources/user/user.api';


import { validateEmail, validatePassword } from 'helpers/validate';
import extractApiErrorMessage from 'helpers/extractApiErrorMessage';

import styles from './SignIn.styles';

function SignIn({ route }) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { userType } = route.params;
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [inputErrors, setInputErrors] = useState({
    email: [],
    password: [],
  });

  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const changeEmailValue = useCallback((value) => {
    setEmailValue((value || '').trim().toLowerCase());
  }, []);

  const changePasswordValue = useCallback((value) => {
    setPasswordValue((value || '').trim());
  }, []);

  const onEmailBlur = useCallback(() => {
    if (validateEmail(emailValue)) {
      setInputErrors({
        ...inputErrors,
        email: [],
      });
    } else {
      setInputErrors({
        ...inputErrors,
        email: [t('SignIn.EmailIsInvalid')],
      });
    }
  }, [emailValue, inputErrors, t]);

  const onPasswordBlur = useCallback(() => {
    if (validatePassword(passwordValue)) {
      setInputErrors({
        ...inputErrors,
        password: [],
      });
    } else {
      setInputErrors({
        ...inputErrors,
        password: [t('SignIn.PasswordMustContainAtLeast6Characters')],
      });
    }
  }, [passwordValue, inputErrors, t]);

  const onPressSignIn = useCallback(async () => {
    let isErrors = false;

    if (!validateEmail(emailValue)) {
      isErrors = true;
      setInputErrors({
        ...inputErrors,
        email: [t('SignIn.EmailIsInvalid')],
      });
    } else if (inputErrors.email.length) {
      setInputErrors({
        ...inputErrors,
        email: [],
      });
    }

    if (!validatePassword(passwordValue)) {
      isErrors = true;
      setInputErrors({
        ...inputErrors,
        password: [t('SignIn.PasswordMustContainAtLeast6Characters')],
      });
    } else if (inputErrors.password.length) {
      setInputErrors({
        ...inputErrors,
        password: [],
      });
    }

    if (!isErrors) {
      try {
        setIsLoading(true);

        await dispatch(userActions.emailSignIn({
          email: emailValue,
          password: passwordValue,
          userType,
          navigation,
        }));

        await userApi.updateLastUsedOs();
      } catch (err) {
        console.error('Login error:', err);
        setApiError(extractApiErrorMessage(err));
        setIsLoading(false);
      }
    }
  }, [emailValue, passwordValue, userType, dispatch, inputErrors, t, navigation]);

  const onChangeInputValue = useCallback((inputName) => {
    if (apiError) {
      setApiError('');
    }

    if (inputErrors[inputName].length) {
      setInputErrors({
        ...inputErrors,
        [inputName]: [],
      });
    }
  }, [inputErrors, apiError]);

  const onPressSignUp = useCallback(() => {
    if (userType === USER_TYPES.FIGHTER) {
      navigation.navigate('SignUp', { userType });
    } else {
      Linking.openURL(`${config.webUrl}/signup`);
    }
  }, [navigation, userType]);

  const onPressForgotPassword = useCallback(() => {
    navigation.navigate('ForgotPassword', { userType });
  }, [navigation, userType]);


  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <KeyboardAvoidingView behavior="position" style={styles.keyboardAvoiding}>
          <View style={styles.keyboardAvoidingChildContainer}>
            <View>
              <LogoAsset style={styles.logo} />

              <View style={styles.titleContainer}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={navigation.goBack}
                  style={styles.backButtonWrapper}
                >
                  <View style={styles.backButton}>
                    <BackArrowIcon />
                  </View>
                </TouchableOpacity>
                <Text style={styles.title}>
                  {userType === USER_TYPES.FIGHTER ? t('SignIn.SignInAsFighter') : t('SignIn.SignInAsFan')}
                </Text>
              </View>

              <View style={styles.errorContainer}>
                {!!apiError && (
                <View style={styles.error}>
                  <ErrorIcon />
                  <Text style={styles.errorText}>{apiError}</Text>
                </View>
                )}
              </View>

              <Input
                label={t('SignIn.Email')}
                value={emailValue}
                onChange={(value) => { onChangeInputValue('email'); changeEmailValue(value); }}
                onBlur={onEmailBlur}
                errors={inputErrors.email}
                style={styles.emailInput}
                autoCapitalize="none"
              />

              <View>
                <Input
                  label={t('SignIn.Password')}
                  value={passwordValue}
                  onChange={(value) => { onChangeInputValue('password'); changePasswordValue(value); }}
                  type="password"
                  onBlur={onPasswordBlur}
                  errors={inputErrors.password}
                />
                <TouchableOpacity onPress={onPressForgotPassword}>
                  <Text style={styles.forgotPassword}>{t('SignIn.ForgotPassword?')}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.signInButtonWrapper}>
              <Button
                title={t('SignIn.SignIn')}
                disabled={!emailValue
                  || !passwordValue
                  || !!inputErrors.email.length
                  || !!inputErrors.password.length}
                onPress={onPressSignIn}
                style={styles.button}
                isLoading={isLoading}
              />

              {userType === USER_TYPES.FIGHTER && (
                <View style={styles.signUpTextWrapper}>
                  <Text style={styles.signUpText}>{t('SignIn.DontHaveAccount?')}</Text>
                  <Button
                    type="link"
                    title={t('SignIn.SignUp')}
                    onPress={onPressSignUp}
                    style={styles.signUpTextLinkWrapper}
                  />
                </View>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}

SignIn.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      userType: PropTypes.oneOf(Object.values(USER_TYPES)).isRequired,
    }),
  }).isRequired,
};

export default SignIn;
