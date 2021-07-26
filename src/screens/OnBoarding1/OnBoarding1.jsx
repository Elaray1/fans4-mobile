import React, { useCallback } from 'react';
import { Image, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import * as userSelectors from 'resources/user/user.selectors';

import IllustrationScreen from 'components/IllustrationScreen';

import FighterIllustration from 'assets/illustrations/onboarding1-fighter.png'; // eslint-disable-line import/extensions
import FanIllustration from 'assets/illustrations/onboarding1-fan.png'; // eslint-disable-line import/extensions

import { USER_TYPES } from 'resources/user/user.constants';

import styles from './styles';

const MAX_WIDTH_HEIGHT_PERCENT = 55;

function OnBoarding1() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const height = screenHeight * MAX_WIDTH_HEIGHT_PERCENT / 100;

  const userType = useSelector(userSelectors.getUserType);

  const Illustration = userType === USER_TYPES.FAN ? FanIllustration : FighterIllustration;

  const onNext = useCallback(() => {
    navigation.navigate('OnBoarding2', { userType });
  }, [navigation, userType]);

  return (
    <IllustrationScreen
      contentStyles={styles.content}
      ilustrationContainerStyles={styles.ilustrationContainer}
      buttonText={t(`OnBoarding1.${userType}.buttonText`)}
      description={t(`OnBoarding1.${userType}.description`)}
      title={t(`OnBoarding1.${userType}.title`)}
      illustration={<Image source={Illustration} resizeMode="cover" style={{ width: screenWidth, height }} />}
      onButtonPress={onNext}
    />
  );
}

export default React.memo(OnBoarding1);
