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
import { getMaskedDeviceId } from 'helpers/deviceInfo';

import { USER_TYPES } from 'resources/user/user.constants';

import styles from './ForgotPassword.styles';

function ForgotPassword({ route }) {
  const deviceId = getMaskedDeviceId();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { userType } = route.params;

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onBackToSignIn = useCallback(() => {
    navigation.navigate('SignIn');
  }, [navigation]);

  const onButtonPress = useCallback(async () => {
    try {
      setIsLoading(true);
      await userApi.forgotPassword({ email, deviceId, userType });
      navigation.navigate('ResetPasswordLink');
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  }, [deviceId, email, navigation, userType]);

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
              autoCapitalize="none"
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

ForgotPassword.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      userType: PropTypes.oneOf(Object.values(USER_TYPES)),
    }),
  }).isRequired,
};

export default ForgotPassword;
