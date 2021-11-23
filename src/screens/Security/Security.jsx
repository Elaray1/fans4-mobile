import React, { useState, useCallback } from 'react';
import {
  SafeAreaView, ScrollView, View,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import Header from 'components/Header';
import Input from 'components/Input';

import extractApiErrorMessage from 'helpers/extractApiErrorMessage';

import * as rootNavigation from 'helpers/rootNavigation';

import * as userApi from 'resources/user/user.api';

import { validatePassword } from 'helpers/validate';

import styles from './Security.styles';

function Security() {
  const { t } = useTranslation();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [inputErrors, setInputErrors] = useState({
    oldPassword: [],
    newPassword: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const onPasswordBlur = useCallback((field, inputValue) => {
    if (validatePassword(inputValue)) {
      setInputErrors({
        ...inputErrors,
        [field]: [],
      });
    } else {
      setInputErrors({
        ...inputErrors,
        [field]: [t('Security.PasswordMustContainAtLeast6Characters')],
      });
      return;
    }

    if (oldPassword === newPassword) {
      setInputErrors({
        ...inputErrors,
        newPassword: [t('Security.yourNewPasswordCannotBeTheSameAsYourOldPassword')],
      });
    }
  }, [inputErrors, t, oldPassword, newPassword]);

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

    if (oldPassword === newPassword) {
      setInputErrors({
        ...inputErrors,
        oldPassword: [t('Security.yourNewPasswordCannotBeTheSameAsYourOldPassword')],
      });
      return;
    }

    [
      { field: 'oldPassword', value: oldPassword },
      { field: 'newPassword', value: newPassword },
    ].forEach(({ field, value }) => {
      if (!validatePassword(value)) {
        isErrors = true;
        setInputErrors({
          ...inputErrors,
          [field]: [t('Security.PasswordMustContainAtLeast6Characters')],
        });
      }
    });

    if (!isErrors) {
      setIsLoading(true);

      try {
        await userApi.updatePassword({ oldPassword, newPassword });
        rootNavigation.reset({ routes: [{ name: 'AppStack', params: { screen: 'PasswordUpdated' } }] });
      } catch (err) {
        setInputErrors({
          ...inputErrors,
          oldPassword: [extractApiErrorMessage(err)],
        });
        setIsLoading(false);
      }
    }
  }, [oldPassword, newPassword, inputErrors, t]);

  const isSaveButtonDisabled = isLoading
  || !oldPassword
  || !newPassword
  || oldPassword === newPassword
  || !!inputErrors.oldPassword.length
  || !!inputErrors.newPassword.length;

  const saveButtonProps = isSaveButtonDisabled
    ? { rightItemStyle: styles.disabledText }
    : {};

  return (
    <SafeAreaView style={styles.screen}>
      <Header
        title={t('Security.security')}
        leftItemType="backArrow"
        rightItemType="text"
        rightItemText={t('Security.save')}
        onRightItemPress={onPressSave}
        rightItemDisabled={isSaveButtonDisabled}
        {...saveButtonProps}
      />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.oldPassword}>
          <Input
            label={t('Security.currentPassword')}
            value={oldPassword}
            onChange={(value) => { setOldPassword(value); onChangeInputValue('oldPassword'); }}
            type="password"
            onBlur={() => onPasswordBlur('oldPassword', oldPassword)}
            errors={inputErrors.oldPassword}
          />
        </View>
        <Input
          label={t('Security.newPassword')}
          value={newPassword}
          onChange={(value) => { setNewPassword(value); onChangeInputValue('newPassword'); }}
          type="password"
          onBlur={() => onPasswordBlur('newPassword', newPassword)}
          errors={inputErrors.newPassword}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

export default Security;
