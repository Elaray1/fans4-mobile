import React from 'react';
import { useTranslation } from 'react-i18next';

import IllustrationScreen from 'components/IllustrationScreen';

import PlaceholderIllustration from 'assets/illustrations/placeholder';

function VerificationSuccessful() {
  const { t } = useTranslation();
  return (
    <IllustrationScreen
      buttonText={t('VerificationSuccessful.buttonText')}
      description={t('VerificationSuccessful.description')}
      title={t('VerificationSuccessful.title')}
      illustration={<PlaceholderIllustration />}
    />
  );
}

export default VerificationSuccessful;
