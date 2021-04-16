import React from 'react';
import { useTranslation } from 'react-i18next';

import Illustration from 'components/Illustration';

function VerificationPending() {
  const { t } = useTranslation();
  return (
    <Illustration
      linkText={t('VerificationPending.linkText')}
      description={t('VerificationPending.description')}
      title={t('VerificationPending.title')}
    />
  );
}

export default VerificationPending;
