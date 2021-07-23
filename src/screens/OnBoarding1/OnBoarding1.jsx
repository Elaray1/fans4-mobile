import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import * as userSelectors from 'resources/user/user.selectors';

import IllustrationScreen from 'components/IllustrationScreen';

import FighterIllustration from 'assets/illustrations/onboarding1-fighter';
import FanIllustration from 'assets/illustrations/onboarding1-fan';

import { USER_TYPES } from 'resources/user/user.constants';

import styles from './styles';

function OnBoarding1() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const userType = useSelector(userSelectors.getUserType);

  const Illustration = userType === USER_TYPES.FAN ? FanIllustration : FighterIllustration;

  const onNext = useCallback(() => {
    navigation.navigate('OnBoarding2', { userType });
  }, [navigation, userType]);

  return (
    <IllustrationScreen
      buttonText={t(`OnBoarding1.${userType}.buttonText`)}
      description={t(`OnBoarding1.${userType}.description`)}
      title={t(`OnBoarding1.${userType}.title`)}
      illustration={<Illustration style={styles.illustration} />}
      onButtonPress={onNext}
    />
  );
}

export default React.memo(OnBoarding1);
