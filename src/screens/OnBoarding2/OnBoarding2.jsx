import React from 'react';
import { useTranslation } from 'react-i18next';

import IllustrationScreen from 'components/IllustrationScreen';

import PlaceholderIllustration from 'assets/illustrations/placeholder';

function OnBoarding2() {
  const { t } = useTranslation();
  return (
    <IllustrationScreen
      buttonText={t('OnBoarding2.buttonText')}
      description={t('OnBoarding2.description')}
      title={t('OnBoarding2.title')}
      illustration={<PlaceholderIllustration />}
    />
  );
}

export default React.memo(OnBoarding2);
