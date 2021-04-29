import React, { useState, useCallback, useEffect } from 'react';
import {
  SafeAreaView, View, ScrollView, StatusBar,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import colors from 'themes/colors';

import Header from 'components/Header';
import Input from 'components/Input';
import Text from 'components/Text';
import Button from 'components/Button';

import * as userApi from 'resources/user/user.api';
import * as userActions from 'resources/user/user.actions';
import { validatePassword } from 'helpers/validate';

import styles from './ChangePassword.styles';

function ChangePassword() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [password, setPassword] = useState('');

  const onBackToSignIn = useCallback(async () => {
    await dispatch(userActions.logout());
    navigation.reset({ routes: [{ name: 'AuthStack', params: { screen: 'SelectUserType' } }] });
  }, [dispatch, navigation]);

  const onButtonPress = useCallback(async () => {
    try {
      await userApi.resetPassword({ password });
      await dispatch(userActions.logout());
      navigation.reset({ routes: [{ name: 'AuthStack', params: { screen: 'PasswordUpdate' } }] });
    } catch (error) {
      console.error(error);
    }
  }, [password, dispatch, navigation]);

  useEffect(() => dispatch(userActions.logout()));

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />
      <Header leftItemType="backArrow" title={t('ChangePassword.title')} />
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.text}>{t('ChangePassword.text')}</Text>
            <Input
              label={t('ChangePassword.inputLabel')}
              value={password}
              type="password"
              onChange={setPassword}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title={t('ChangePassword.button')}
              onPress={onButtonPress}
              disabled={!validatePassword(password)}
            />
            <Button
              title={t('ChangePassword.link')}
              onPress={onBackToSignIn}
              type="link"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default ChangePassword;
