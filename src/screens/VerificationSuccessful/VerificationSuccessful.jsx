import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import analyticsService from 'services/analytics.service';

import IllustrationScreen from 'components/IllustrationScreen';

import SuccessfulIllustration from 'assets/illustrations/verification-successful.svg';

function VerificationSuccessful() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const onNext = useCallback(() => {
    navigation.navigate('OnBoarding');
  }, [navigation]);

  useEffect(() => {
    analyticsService.logEvent({
      name: analyticsService.events.FIGHTER_SUCCESSFULL_VERIFICATION_OPENED,
    });
  }, []);

  return (
    <IllustrationScreen
      buttonText={t('VerificationSuccessful.buttonText')}
      description={t('VerificationSuccessful.description')}
      title={t('VerificationSuccessful.title')}
      illustration={<SuccessfulIllustration />}
      onButtonPress={onNext}
    />
  );
}

export default React.memo(VerificationSuccessful);
