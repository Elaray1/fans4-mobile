import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView, View, StatusBar, ScrollView, KeyboardAvoidingView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import * as userActions from 'resources/user/user.actions';

import colors from 'themes/colors';

import Logo from 'assets/icons/logo';

import Text from 'components/Text';
import Button from 'components/Button';
import Header from 'components/Header';
import Input from 'components/Input';

import { USER_TYPES } from 'resources/user/user.constants';
import { validateEmail, validatePassword } from 'helpers/validate';

import styles from './SignUp.styles';

function SignUp({ route }) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { userType } = route.params;

  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [inputErrors, setInputErrors] = useState({
    email: [],
    password: [],
  });
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onEmailBlur = useCallback(() => {
    setIsInputFocused(false);
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
    setIsInputFocused(false);
    if (validatePassword(passwordValue)) {
      setInputErrors({
        ...inputErrors,
        password: [],
      });
    } else {
      setInputErrors({
        ...inputErrors,
        password: [t('SignUp.PasswordShouldContainAtLeast6Characters')],
      });
    }
  }, [passwordValue, inputErrors, t]);

  const onPressSignUp = useCallback(async () => {
    try {
      setIsLoading(true);

      const email = emailValue;

      await userActions.emailSignUp({
        email,
        password: passwordValue,
        userType,
      });

      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'EmailConfirmation',
            params: { email, userType, isResendEmail: false },
          },
        ],
      });
    } catch (err) {
      // TODO show error
    } finally {
      setIsLoading(false);
    }
  }, [emailValue, passwordValue, userType, navigation]);

  const onInputFocused = useCallback(() => {
    setIsInputFocused(true);
  }, []);

  const onPressSignIn = useCallback(() => {
    navigation.navigate('SignIn', { userType });
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
              title={userType === USER_TYPES.FIGHTER ? t('SignUp.SignUpAsFighter') : t('SignUp.SignUpAsFollower')}
              isBackArrow
              isBottomLine={false}
            />
            <View style={styles.inputWrapper}>
              <Input
                label={t('SignUp.Email')}
                value={emailValue}
                onChange={setEmailValue}
                onFocus={onInputFocused}
                onBlur={onEmailBlur}
                errors={inputErrors.email}
                style={styles.input}
              />
              <Input
                label={t('SignUp.Password')}
                value={passwordValue}
                onChange={setPasswordValue}
                type="password"
                onFocus={onInputFocused}
                onBlur={onPasswordBlur}
                errors={inputErrors.password}
              />
            </View>
          </View>
          <View>
            <Button
              title={t('SignUp.SignUp')}
              disabled={!emailValue
                || !passwordValue
                || isInputFocused
                || !!inputErrors.email.length
                || !!inputErrors.password.length}
              onPress={onPressSignUp}
              style={styles.button}
              isLoading={isLoading}
            />
            <View style={styles.signIn}>
              <Text style={styles.text}>{t('SignUp.AlreadyHaveAccount')}</Text>
              <Button
                type="link"
                title={t('SignUp.SignIn')}
                onPress={onPressSignIn}
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
