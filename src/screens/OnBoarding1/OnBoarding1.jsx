import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import * as userSelectors from 'resources/user/user.selectors';

import IllustrationScreen from 'components/IllustrationScreen';

import PlaceholderIllustration from 'assets/illustrations/placeholder';

function OnBoarding1() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const userType = useSelector(userSelectors.getUserType);

  const onNext = useCallback(() => {
    navigation.navigate('OnBoarding2', { userType });
  }, [navigation, userType]);

  return (
    <IllustrationScreen
      buttonText={t(`OnBoarding1.${userType}.buttonText`)}
      description={t(`OnBoarding1.${userType}.description`)}
      title={t(`OnBoarding1.${userType}.title`)}
      illustration={<PlaceholderIllustration />}
      onButtonPress={onNext}
    />
  );
}

export default React.memo(OnBoarding1);
