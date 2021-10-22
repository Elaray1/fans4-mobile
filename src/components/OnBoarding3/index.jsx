import React, { useCallback } from 'react';
import { Image, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';


import IllustrationScreen from 'components/IllustrationScreen';

import FighterIllustration from 'assets/illustrations/onboarding3-fighter.png'; // eslint-disable-line import/extensions
import FanIllustration from 'assets/illustrations/onboarding3-fan.png'; // eslint-disable-line import/extensions

import * as userApi from 'resources/user/user.api';
import { USER_TYPES } from 'resources/user/user.constants';
import * as userSelectors from 'resources/user/user.selectors';

import analyticsService from 'services/analytics.service';

import styles from './styles';

const MAX_WIDTH_HEIGHT_PERCENT = 55;

function OnBoarding3(props) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const userType = useSelector(userSelectors.getUserType);

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const height = screenHeight * MAX_WIDTH_HEIGHT_PERCENT / 100;

  const Illustration = userType === USER_TYPES.FAN ? FanIllustration : FighterIllustration;

  const onNext = useCallback(async () => {
    navigation.reset({ routes: [{ name: 'AppStack', params: { screen: 'Account' } }] });

    try {
      await userApi.completeOnboarding();
      if (userType === USER_TYPES.FIGHTER) {
        analyticsService.logEvent({
          name: analyticsService.events.FIGHTER_ONBOARDING_COMPLETED });
      } else {
        analyticsService.logEvent({ name: analyticsService.events.FAN_ONBOARDING_COMPLETED });
      }
    } catch (err) {
      console.error(err);
    }
  }, [navigation, userType]);

  return (
    <IllustrationScreen
      contentStyles={styles.content}
      illustrationContainerStyles={styles.ilustrationContainer}
      buttonText={t(`OnBoarding3.${userType}.buttonText`)}
      description={t(`OnBoarding3.${userType}.description`)}
      title={t(`OnBoarding3.${userType}.title`)}
      illustration={<Image source={Illustration} resizeMode="cover" style={{ width: screenWidth, height }} />}
      onButtonPress={onNext}
      isIllustrationGradient
      descriptionStyles={styles.description}
      {...props}
    />
  );
}

export default React.memo(OnBoarding3);
