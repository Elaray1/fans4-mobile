import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import IllustrationScreen from 'components/IllustrationScreen';

import * as userActions from 'resources/user/user.actions';
import * as userSelectors from 'resources/user/user.selectors';

import analyticsService from 'services/analytics.service';

import FailedIllustration from 'assets/illustrations/account-blocked.svg';

function VerificationFailed() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const userName = useSelector(userSelectors.getUserFullName);
  const userId = useSelector(userSelectors.getUserId);
  const userType = useSelector(userSelectors.getUserType);

  const onButtonPress = useCallback(() => {
    Linking.openURL(`mailto:admin@fans4.com?subject=Failed verification. ${userName}`);
  }, [userName]);

  const goToSignIn = useCallback(async () => {
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
    dispatch(userActions.logout());
  }, [dispatch]);

  useEffect(() => {
    analyticsService.logEvent({
      name: analyticsService.events.FIGHTER_FAILED_VERIFICATION_OPENED,
      data: {
        userId,
      },
    });
  }, [userId]);


  return (
    <IllustrationScreen
      linkText={t('VerificationFailed.linkText')}
      onLinkPress={goToSignIn}
      buttonText={t('VerificationFailed.buttonText')}
      description={t('VerificationFailed.description')}
      title={t('VerificationFailed.title')}
      onButtonPress={onButtonPress}
      illustration={<FailedIllustration />}
    />
  );
}

export default React.memo(VerificationFailed);
