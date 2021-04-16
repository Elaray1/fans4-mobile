import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';

import IllustrationScreen from 'components/IllustrationScreen';

import PlaceholderIllustration from 'assets/illustrations/placeholder';

function VerificationFailed() {
  const { t } = useTranslation();
  const onButtonPress = useCallback(() => {
    Linking.openURL('mailto:admin@fans4.com?subject="Failed verification. John Doe"');
  }, []);

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

export default VerificationFailed;
