import React, { useState, useCallback } from 'react';
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

import * as userActions from 'resources/user/user.actions';
import { validateEmail } from 'helpers/validate';

import styles from './ForgotPassword.styles';

function ForgotPassword() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onBackToSignIn = useCallback(() => {
    navigation.navigate('SignIn');
  }, [navigation]);

  const onButtonPress = useCallback(async () => {
    try {
      setIsLoading(true);
      await userActions.forgotPassword(email);
      navigation.navigate('ResetPasswordLink');
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  }, [email, navigation]);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />
      <Header leftItemType="backArrow" title={t('ForgotPassword.title')} />
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.text}>{t('ForgotPassword.text')}</Text>
            <Input
              label={t('ForgotPassword.inputLabel')}
              value={email}
              onChange={setEmail}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title={t('ForgotPassword.button')}
              onPress={onButtonPress}
              disabled={!validateEmail(email) || isLoading}
            />
            <Button
              title={t('ForgotPassword.link')}
              onPress={onBackToSignIn}
              type="link"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default ForgotPassword;
