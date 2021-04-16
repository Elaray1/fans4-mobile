import React from 'react';
import { useTranslation } from 'react-i18next';

import IllustrationScreen from 'components/IllustrationScreen';

import PlaceholderIllustration from 'assets/illustrations/placeholder';

function VerificationPending() {
  const { t } = useTranslation();
  return (
    <IllustrationScreen
      linkText={t('VerificationPending.linkText')}
      description={t('VerificationPending.description')}
      title={t('VerificationPending.title')}
      illustration={<PlaceholderIllustration />}
    />
  );
}

export default VerificationPending;
