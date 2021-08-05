import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView,
  View,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import * as userActions from 'resources/user/user.actions';

import colors from 'themes/colors';

import Logo from 'assets/icons/logo';
import ErrorIcon from 'assets/icons/error';
import BackArrowIcon from 'assets/icons/back-arrow';

import Text from 'components/Text';
import Button from 'components/Button';
import Input from 'components/Input';

import { USER_TYPES } from 'resources/user/user.constants';

import { validateEmail, validatePassword } from 'helpers/validate';
import extractApiErrorMessage from 'helpers/extractApiErrorMessage';

import styles from './SignUp.styles';

function SignUp({ route }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { userType } = route.params;

  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [inputErrors, setInputErrors] = useState({
    email: [],
    password: [],
  });

  const changeEmailValue = useCallback((value) => {
    setEmailValue((value || '').trim().toLowerCase());
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const onEmailBlur = useCallback(() => {
    if (validateEmail(emailValue)) {
      setInputErrors({
        ...inputErrors,
        email: [],
      });
    } else {
      setInputErrors({
        ...inputErrors,
        email: [t('SignUp.EmailIsInvalid')],
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
        password: [t('SignUp.PasswordMustContainAtLeast6Characters')],
      });
    }
  }, [passwordValue, inputErrors, t]);

  const onPressSignUp = useCallback(async () => {
    let isErrors = false;
    if (!validateEmail(emailValue)) {
      isErrors = true;
      setInputErrors({
        ...inputErrors,
        email: [t('SignUp.EmailIsInvalid')],
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
        password: [t('SignUp.PasswordMustContainAtLeast6Characters')],
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
        const email = emailValue;

        await dispatch(userActions.emailSignUp({
          email,
          password: passwordValue,
          userType,
        }));
      } catch (err) {
        console.error('Signup error:', err);
        setIsLoading(false);
        setApiError(extractApiErrorMessage(err));
      }
    }
  }, [emailValue, passwordValue, userType, inputErrors, t, dispatch]);

  const onChangeInputValue = useCallback((inputName) => {
    if (inputErrors[inputName].length) {
      setInputErrors({
        ...inputErrors,
        [inputName]: [],
      });
    }

    setApiError('');
  }, [inputErrors]);

  const onPressSignIn = useCallback(() => {
    navigation.navigate('SignIn', { userType });
  }, [navigation, userType]);

  const goToSelectType = useCallback(() => {
    navigation.navigate('SelectUserType', { userType });
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
              <Logo style={styles.logo} />

              <View style={styles.titleContainer}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={goToSelectType}
                  style={styles.backButtonWrapper}
                >
                  <View style={styles.backButton}>
                    <BackArrowIcon />
                  </View>
                </TouchableOpacity>
                <Text style={styles.title}>
                  {userType === USER_TYPES.FIGHTER ? t('SignUp.SignUpAsFighter') : t('SignUp.SignUpAsFan')}
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

              <View style={styles.emailInput}>
                <Input
                  label={t('SignUp.Email')}
                  value={emailValue}
                  onChange={(value) => { onChangeInputValue('email'); changeEmailValue(value); }}
                  onBlur={onEmailBlur}
                  errors={inputErrors.email}
                  type="emailAddress"
                  autoCapitalize="none"
                />
              </View>

              <Input
                label={t('SignUp.Password')}
                value={passwordValue}
                onChange={(value) => { onChangeInputValue('password'); setPasswordValue(value); }}
                type="password"
                autoCapitalize="none"
                onBlur={onPasswordBlur}
                errors={inputErrors.password}
              />
            </View>

            <View style={styles.signUpButtonWrapper}>
              <Button
                title={t('SignUp.SignUp')}
                disabled={!emailValue
                  || !passwordValue
                  || !!inputErrors.email.length
                  || !!inputErrors.password.length}
                onPress={onPressSignUp}
                style={styles.button}
                isLoading={isLoading}
              />
              <View style={styles.signInTextWrapper}>
                <Text style={styles.signInText}>{t('SignUp.AlreadyHaveAccount')}</Text>
                <Button
                  type="link"
                  title={t('SignUp.SignIn')}
                  onPress={onPressSignIn}
                  style={styles.signInTextLinkWrapper}
                />
              </View>
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
