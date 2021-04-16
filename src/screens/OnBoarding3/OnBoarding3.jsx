import React from 'react';
import { useTranslation } from 'react-i18next';

import Illustration from 'components/Illustration';

function OnBoarding3() {
  const { t } = useTranslation();
  return (
    <Illustration
      buttonText={t('OnBoarding3.buttonText')}
      description={t('OnBoarding3.description')}
      title={t('OnBoarding3.title')}
    />
  );
}

export default OnBoarding3;
