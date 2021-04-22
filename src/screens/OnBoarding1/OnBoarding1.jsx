import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import IllustrationScreen from 'components/IllustrationScreen';

import PlaceholderIllustration from 'assets/illustrations/placeholder';

function OnBoarding1() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const onNext = useCallback(() => {
    navigation.navigate('OnBoarding2');
  }, [navigation]);

  return (
    <IllustrationScreen
      buttonText={t('OnBoarding1.buttonText')}
      description={t('OnBoarding1.description')}
      title={t('OnBoarding1.title')}
      illustration={<PlaceholderIllustration />}
      onButtonPress={onNext}
    />
  );
}

export default React.memo(OnBoarding1);
