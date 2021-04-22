import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import IllustrationScreen from 'components/IllustrationScreen';

import PlaceholderIllustration from 'assets/illustrations/placeholder';

function OnBoarding2() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const onNext = useCallback(() => {
    navigation.navigate('OnBoarding3');
  }, [navigation]);

  return (
    <IllustrationScreen
      buttonText={t('OnBoarding2.buttonText')}
      description={t('OnBoarding2.description')}
      title={t('OnBoarding2.title')}
      illustration={<PlaceholderIllustration />}
      onButtonPress={onNext}
    />
  );
}

export default React.memo(OnBoarding2);
