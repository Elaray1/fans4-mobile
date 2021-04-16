import React from 'react';
import { useTranslation } from 'react-i18next';

import Illustration from 'components/Illustration';

function OnBoarding1() {
  const { t } = useTranslation();
  return (
    <Illustration
      buttonText={t('OnBoarding1.buttonText')}
      description={t('OnBoarding1.description')}
      title={t('OnBoarding1.title')}
    />
  );
}

export default OnBoarding1;
