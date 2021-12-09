import React, { useCallback, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useNavigation, useIsFocused } from '@react-navigation/native';

import * as rootNavigation from 'helpers/rootNavigation';
import { getMaskedDeviceId } from 'helpers/deviceInfo';

import websocketsService from 'services/socket.service';

import * as userApi from 'resources/user/user.api';

import IllustrationScreen from 'components/IllustrationScreen';

import EmailIllustration from 'assets/illustrations/email';

import { USER_TYPES } from 'resources/user/user.constants';

const handleReceivingResetToken = async ({ resetPasswordToken, userType }) => {
  rootNavigation.resetToScreen('AuthStack', 'ChangePassword', { resetPasswordToken, userType });
};

function ResetPasswordLink({ route }) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const checkTokenIntervalTimerRef = useRef();

  const { email, userType } = route.params;

  const checkToken = useCallback(async () => {
    let resetPasswordToken;

    try {
      const res = await userApi.getPasswordResetToken({ deviceId: getMaskedDeviceId(), email, userType });
      resetPasswordToken = res && res.resetPasswordToken;
    } catch (err) {
      console.error('getting password reset token error:', err);
    }

    if (resetPasswordToken) {
      handleReceivingResetToken({ resetPasswordToken, userType });
      clearInterval(checkTokenIntervalTimerRef.current);
    }
  }, [email, userType]);

  useEffect(() => {
    checkTokenIntervalTimerRef.current = setInterval(checkToken, 3000);
    return () => checkTokenIntervalTimerRef.current && clearInterval(checkTokenIntervalTimerRef.current);
  }, [checkToken]);

  useEffect(() => {
    const handleReceivingResetTokenOnFocus = async (appState) => {
      if (isFocused && appState === 'active') {
        await checkToken();
      }
    };

    AppState.addEventListener('change', handleReceivingResetTokenOnFocus);

    return () => {
      AppState.removeEventListener('change', handleReceivingResetTokenOnFocus);
    };
  }, [isFocused, navigation, checkToken]);

  useEffect(() => {
    websocketsService.on('email:password-reset', handleReceivingResetToken);
    return () => websocketsService.off('email:password-reset', handleReceivingResetToken);
  }, []);

  const onLinkPress = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'SelectUserType',
        },
      ],
    });
  }, [navigation]);

  return (
    <IllustrationScreen
      linkText={t('ResetPassword.linkText')}
      onLinkPress={onLinkPress}
      description={`${t('ResetPassword.description_0')}${email}${t('ResetPassword.description_1')}`}
      title={t('ResetPassword.title')}
      illustration={<EmailIllustration />}
    />
  );
}

ResetPasswordLink.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      email: PropTypes.string.isRequired,
      userType: PropTypes.oneOf(Object.values(USER_TYPES)).isRequired,
    }),
  }).isRequired,
};

export default React.memo(ResetPasswordLink);
