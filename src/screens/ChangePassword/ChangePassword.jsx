import React, { useState, useCallback } from 'react';
import { SafeAreaView, View, ScrollView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import colors from 'themes/colors';
import Header from 'components/Header';
import Input from 'components/Input';
import Text from 'components/Text';
import Button from 'components/Button';
import * as userApi from 'resources/user/user.api';
import { USER_TYPES } from 'resources/user/user.constants';
import { validatePassword } from 'helpers/validate';
import * as rootNavigation from 'helpers/rootNavigation';

import styles from './ChangePassword.styles';

function ChangePassword({ route }) {
  const navigation = useNavigation();

  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const { resetPasswordToken, userType } = route.params;

  const onBackToSignIn = useCallback(async () => {
    navigation.reset({
      index: 1,
      routes: [{
        name: 'AuthStack',
        state: {
          routes: [{
            name: 'SelectUserType',
          }],
        },
      }, {
        name: 'AuthStack',
        state: {
          routes: [{
            name: 'SignIn',
            params: {
              userType,
            },
          }],
        },
      }],
    });
  }, [navigation, userType]);

  const onButtonPress = useCallback(async () => {
    try {
      await userApi.resetPassword({ password, resetPasswordToken });
      rootNavigation.resetToScreen('AuthStack', 'PasswordReseted', { userType });
    } catch (error) {
      console.error(error);
    }
  }, [password, resetPasswordToken, userType]);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />

      <Header leftItemType="backArrow" onLeftItemPress={onBackToSignIn} title={t('ChangePassword.title')} />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
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

ChangePassword.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      resetPasswordToken: PropTypes.string.isRequired,
      userType: PropTypes.oneOf(Object.values(USER_TYPES)).isRequired,
    }),
  }).isRequired,
};

export default React.memo(ChangePassword);
