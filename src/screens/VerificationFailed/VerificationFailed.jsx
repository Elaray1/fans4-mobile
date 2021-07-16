import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import IllustrationScreen from 'components/IllustrationScreen';

import * as userActions from 'resources/user/user.actions';
import * as userSelectors from 'resources/user/user.selectors';

import * as rootNavigation from 'helpers/rootNavigation';

import FailedIllustration from 'assets/illustrations/verification-pending.svg';

function VerificationFailed() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const userName = useSelector(userSelectors.getUserFullName);

  const onButtonPress = useCallback(() => {
    Linking.openURL(`mailto:admin@fans4.com?subject=Failed verification. ${userName}`);
  }, [userName]);

  const goToSignUp = useCallback(async () => {
    dispatch(userActions.logout());
    rootNavigation.resetToScreen('AuthStack', 'SelectUserType');
  }, [dispatch]);

  return (
    <IllustrationScreen
      linkText={t('VerificationFailed.linkText')}
      onLinkPress={goToSignUp}
      buttonText={t('VerificationFailed.buttonText')}
      description={t('VerificationFailed.description')}
      title={t('VerificationFailed.title')}
      onButtonPress={onButtonPress}
      illustration={<FailedIllustration />}
    />
  );
}

export default React.memo(VerificationFailed);
