import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView, View, StatusBar, ScrollView, KeyboardAvoidingView, TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import * as userActions from 'resources/user/user.actions';

import colors from 'themes/colors';

import Logo from 'assets/icons/logo';
import ErrorIcon from 'assets/icons/error';

import Text from 'components/Text';
import Button from 'components/Button';
import Header from 'components/Header';
import Input from 'components/Input';

import { USER_TYPES } from 'resources/user/user.constants';
import { validateEmail, validatePassword } from 'helpers/validate';

import styles from './SignIn.styles';

function SignUp({ route }) {
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
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onEmailBlur = useCallback(() => {
    if (isError) {
      setIsError(false);
    }
    setIsInputFocused(false);
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
  }, [emailValue, inputErrors, t, isError]);

  const onPasswordBlur = useCallback(() => {
    if (isError) {
      setIsError(false);
    }
    setIsInputFocused(false);
    if (validatePassword(passwordValue)) {
      setInputErrors({
        ...inputErrors,
        password: [],
      });
    } else {
      setInputErrors({
        ...inputErrors,
        password: [t('SignIn.PasswordShouldContainAtLeast6Characters')],
      });
    }
  }, [passwordValue, inputErrors, t, isError]);

  const onPressSignIn = useCallback(async () => {
    try {
      setIsLoading(true);

      const email = emailValue;

      await dispatch(userActions.emailSignIn({
        email,
        password: passwordValue,
        userType,
      }));
    } catch (err) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [emailValue, passwordValue, userType, dispatch]);

  const onInputFocused = useCallback(() => {
    setIsInputFocused(true);
  }, []);

  const onPressSignUp = useCallback(() => {
    navigation.navigate('SignUp', { userType });
  }, [navigation, userType]);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <KeyboardAvoidingView
          behavior="position"
          style={styles.keyboardAvoiding}
        >
          <View>
            <Logo style={styles.logo} />
            <Header
              title={userType === USER_TYPES.FIGHTER ? t('SignIn.SignInAsFighter') : t('SignIn.SignInAsFollower')}
              isBackArrow
              isBottomLine={false}
            />
            {isError && (
            <View style={styles.error}>
              <ErrorIcon />
              <Text style={styles.errorText}>{t('SignIn.InvalidEmailOrAndPassword')}</Text>
            </View>
            )}
            <View style={[styles.inputWrapper, isError && { marginTop: 25 }]}>
              <Input
                label={t('SignIn.Email')}
                value={emailValue}
                onChange={setEmailValue}
                onFocus={onInputFocused}
                onBlur={onEmailBlur}
                errors={inputErrors.email}
                style={styles.input}
              />
              <View>
                <Input
                  label={t('SignIn.Password')}
                  value={passwordValue}
                  onChange={setPasswordValue}
                  type="password"
                  onFocus={onInputFocused}
                  onBlur={onPasswordBlur}
                  errors={inputErrors.password}
                />
                <TouchableOpacity
                  onPress={() => {}}
                >
                  <Text style={styles.forgotPassword}>{t('SignIn.ForgotPassword?')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View>
            <Button
              title={t('SignIn.SignIn')}
              disabled={!emailValue
                || !passwordValue
                || isInputFocused
                || !!inputErrors.email.length
                || !!inputErrors.password.length
                || isError}
              onPress={onPressSignIn}
              style={styles.button}
              isLoading={isLoading}
            />
            <View style={styles.signIn}>
              <Text style={styles.text}>{t('SignIn.DontHaveAccount?')}</Text>
              <Button
                type="link"
                title={t('SignIn.SignUp')}
                onPress={onPressSignUp}
                style={styles.textLinkWrapper}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}

SignUp.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      userType: PropTypes.oneOf(Object.values(USER_TYPES)),
    }),
  }).isRequired,
};

export default SignUp;
