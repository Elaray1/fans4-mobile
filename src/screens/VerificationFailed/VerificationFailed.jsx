import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';
import { useSelector } from 'react-redux';

import IllustrationScreen from 'components/IllustrationScreen';

import * as userSelectors from 'resources/user/user.selectors';

import PlaceholderIllustration from 'assets/illustrations/placeholder';

function VerificationFailed() {
  const { t } = useTranslation();

  const userName = useSelector(userSelectors.getUserFullName);

  const onButtonPress = useCallback(() => {
    Linking.openURL(`mailto:admin@fans4.com?subject=Failed verification. ${userName}`);
  }, [userName]);

  return (
    <IllustrationScreen
      linkText={t('VerificationFailed.linkText')}
      buttonText={t('VerificationFailed.buttonText')}
      description={t('VerificationFailed.description')}
      title={t('VerificationFailed.title')}
      onButtonPress={onButtonPress}
      illustration={<PlaceholderIllustration />}
    />
  );
}

export default React.memo(VerificationFailed);
