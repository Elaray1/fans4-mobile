import React from 'react';
import { useTranslation } from 'react-i18next';

import Illustration from 'components/Illustration';

function OnBoarding2() {
  const { t } = useTranslation();
  return (
    <Illustration
      buttonText={t('OnBoarding2.buttonText')}
      description={t('OnBoarding2.description')}
      title={t('OnBoarding2.title')}
    />
  );
}

export default OnBoarding2;
