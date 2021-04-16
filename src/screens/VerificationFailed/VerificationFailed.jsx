import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';

import Illustration from 'components/Illustration';

function VerificationFailed() {
  const { t } = useTranslation();
  const onButtonPress = useCallback(() => {
    Linking.openURL('mailto:admin@fans4.com?subject="Failed verification. John Doe"');
  }, []);

  return (
    <Illustration
      linkText={t('VerificationFailed.linkText')}
      buttonText={t('VerificationFailed.buttonText')}
      description={t('VerificationFailed.description')}
      title={t('VerificationFailed.title')}
      onButtonPress={onButtonPress}
    />
  );
}

export default VerificationFailed;
