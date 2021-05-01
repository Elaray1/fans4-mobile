import React, { useState, useCallback, useEffect } from 'react';
import {
  SafeAreaView, ScrollView, View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import _get from 'lodash/get';

import Header from 'components/Header';
import Input from 'components/Input';

import * as socketService from 'services/socket.service';

import * as userActions from 'resources/user/user.actions';

import { validateEmail, validatePassword } from 'helpers/validate';

import styles from './ChangeEmail.styles';

function ChangeEmail() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [inputErrors, setInputErrors] = useState({
    email: [],
    password: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    socketService.on('new-email:verified', (updatedUser) => {
      dispatch(userActions.setUserData(updatedUser));
    });
  }, [dispatch]);

  const onEmailBlur = useCallback(() => {
    if (validateEmail(emailValue)) {
      setInputErrors({
        ...inputErrors,
        email: [],
      });
    } else {
      setInputErrors({
        ...inputErrors,
        email: [t('ChangeEmail.emailIsInvalid')],
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
        password: [t('ChangeEmail.passwordShouldContainAtLeast6Characters')],
      });
    }
  }, [inputErrors, t, passwordValue]);

  const onChangeInputValue = useCallback((inputName) => {
    if (inputErrors[inputName].length) {
      setInputErrors({
        ...inputErrors,
        [inputName]: [],
      });
    }
  }, [inputErrors]);

  const onPressSave = useCallback(async () => {
    let isErrors = false;

    if (!validateEmail(emailValue)) {
      isErrors = true;
      setInputErrors({
        ...inputErrors,
        email: [t('ChangeEmail.emailIsInvalid')],
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
        password: [t('ChangeEmail.passwordShouldContainAtLeast6Characters')],
      });
    } else if (inputErrors.password.length) {
      setInputErrors({
        ...inputErrors,
        password: [],
      });
    }

    if (!isErrors) {
      setIsLoading(true);

      try {
        await dispatch(userActions.updateEmail({
          newEmail: emailValue,
          password: passwordValue,
        }));
      } catch (error) {
        const { password, email } = _get(error, 'data.errors', {});
        if (password) {
          setInputErrors({
            ...inputErrors,
            password: [password],
          });
        } else {
          setInputErrors({
            ...inputErrors,
            email: [email || t('ChangeEmail.anErrorOccurred')],
          });
        }
        setIsLoading(false);
      }
    }
  }, [emailValue, passwordValue, inputErrors, t, dispatch]);

  const isSaveButtonDisabled = isLoading
  || !emailValue
  || !passwordValue
  || !!inputErrors.email.length
  || !!inputErrors.password.length;

  const saveButtonProps = isSaveButtonDisabled
    ? { rightItemStyle: styles.disabledText }
    : {};

  return (
    <SafeAreaView style={styles.screen}>
      <Header
        title={t('ChangeEmail.changeEmail')}
        leftItemType="backArrow"
        rightItemType="text"
        rightItemText={t('ChangeEmail.save')}
        onRightItemPress={onPressSave}
        rightItemDisabled={isSaveButtonDisabled}
        {...saveButtonProps}
      />
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.emailInput}>
          <Input
            label={t('ChangeEmail.newEmail')}
            value={emailValue}
            onChange={(value) => { setEmailValue(value); onChangeInputValue('email'); }}
            onBlur={onEmailBlur}
            errors={inputErrors.email}
          />
        </View>
        <Input
          label={t('ChangeEmail.password')}
          value={passwordValue}
          onChange={(value) => { setPasswordValue(value); onChangeInputValue('password'); }}
          type="password"
          onBlur={onPasswordBlur}
          errors={inputErrors.password}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

export default ChangeEmail;
