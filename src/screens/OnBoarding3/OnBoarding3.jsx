import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import IllustrationScreen from 'components/IllustrationScreen';

import PlaceholderIllustration from 'assets/illustrations/placeholder';

import * as userApi from 'resources/user/user.api';

function OnBoarding3() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const onNext = useCallback(async () => {
    navigation.reset({ routes: [{ name: 'AppStack', params: { screen: 'Account' } }] });

    try {
      await userApi.completeOnboarding();
    } catch (err) {
      console.error(err);
    }
  }, [navigation]);

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
