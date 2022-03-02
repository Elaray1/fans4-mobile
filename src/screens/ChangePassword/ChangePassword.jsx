import React, { useState, useCallback, useEffect } from 'react';
import { SafeAreaView, View, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import colors from 'themes/colors';
import Header from 'components/Header';
import Input from 'components/Input';
import Text from 'components/Text';
import Button from 'components/Button';
import * as userApi from 'resources/user/user.api';
import { USER_TYPES } from 'resources/user/user.constants';
import * as userSelectors from 'resources/user/user.selectors';
import { validatePassword } from 'helpers/validate';
import * as rootNavigation from 'helpers/rootNavigation';
import useToast from 'hooks/useToast';

import styles from './ChangePassword.styles';

function ChangePassword({ route }) {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { showFailure } = useToast();

  const { token, userId, userType, expirationDate } = route.params;

  const isUserAuthenticated = useSelector(userSelectors.getAuthenticated);

  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const onBackToSignIn = useCallback(async () => {
    if (!isUserAuthenticated) {
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

      return;
    }

    navigation.reset({
      index: 0,
      routes: [{
        name: 'AppStack',
        state: {
          routes: [{
            name: 'Account',
          }],
        },
      }],
    });
  }, [navigation, userType, isUserAuthenticated]);

  const navigateToResetPasswordLinkExpired = useCallback(() => {
    navigation.reset({
      index: 1,
      routes: [{
        name: 'AuthStack',
        state: {
          routes: [{
            name: 'ResetPasswordLinkExpired',
            params: {
              userType,
            },
          }],
        },
      }],
    });
  }, [userType, navigation]);

  const submit = useCallback(async () => {
    try {
      await userApi.resetPassword({
        password,
        resetPasswordToken: token,
        userId,
        expirationDate,
      });

      rootNavigation.resetToScreen('AuthStack', 'PasswordReseted', { userType });
    } catch (error) {
      showFailure();
      console.error('Change password err:', error);
    }
  }, [showFailure, password, userType, token, userId, expirationDate]);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);

      try {
        const { isExpired } = await userApi.validateResetPasswordToken({
          resetPasswordToken: token,
          userId,
          expirationDate,
        });

        if (isExpired) {
          navigateToResetPasswordLinkExpired();
          return;
        }

        setIsLoading(false);
      } catch (err) {
        showFailure();
        console.error('validateResetPasswordToken err:', err);
      }
    };

    init();
  }, [token, userId, navigateToResetPasswordLinkExpired, expirationDate, showFailure]);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />

      <Header leftItemType="backArrow" onLeftItemPress={onBackToSignIn} title={t('ChangePassword.title')} />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      {!isLoading && (
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
                onPress={submit}
                disabled={!validatePassword(password)}
              />

              <Button
                title={isUserAuthenticated ? t('ChangePassword.loggedLink') : t('ChangePassword.unloggedLink')}
                onPress={onBackToSignIn}
                type="link"
              />
            </View>
          </View>
        </ScrollView>
      )}

    </SafeAreaView>
  );
}

ChangePassword.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      token: PropTypes.string.isRequired,
      userType: PropTypes.oneOf(Object.values(USER_TYPES)).isRequired,
      userId: PropTypes.string.isRequired,
      expirationDate: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export default React.memo(ChangePassword);
