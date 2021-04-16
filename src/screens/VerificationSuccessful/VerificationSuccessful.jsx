import React from 'react';
import { useTranslation } from 'react-i18next';

import Illustration from 'components/Illustration';

function VerificationSuccessful() {
  const { t } = useTranslation();
  return (
    <Illustration
      buttonText={t('VerificationSuccessful.buttonText')}
      description={t('VerificationSuccessful.description')}
      title={t('VerificationSuccessful.title')}
    />
  );
}

export default VerificationSuccessful;
