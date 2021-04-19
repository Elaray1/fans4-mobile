import React from 'react';
import { useTranslation } from 'react-i18next';

import IllustrationScreen from 'components/IllustrationScreen';

import PlaceholderIllustration from 'assets/illustrations/placeholder';

function OnBoarding1() {
  const { t } = useTranslation();
  return (
    <IllustrationScreen
      buttonText={t('OnBoarding1.buttonText')}
      description={t('OnBoarding1.description')}
      title={t('OnBoarding1.title')}
      illustration={<PlaceholderIllustration />}
    />
  );
}

export default React.memo(OnBoarding1);
