import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import IllustrationScreen from 'components/IllustrationScreen';

import PlaceholderIllustration from 'assets/illustrations/placeholder';

function OnBoarding3() {
  const { t } = useTranslation();

  const onNext = useCallback(() => {
  }, []);

  return (
    <IllustrationScreen
      buttonText={t('OnBoarding3.buttonText')}
      description={t('OnBoarding3.description')}
      title={t('OnBoarding3.title')}
      illustration={<PlaceholderIllustration />}
      onButtonPress={onNext}
    />
  );
}

export default React.memo(OnBoarding3);
