import React, { useCallback } from 'react';
import { Image, useWindowDimensions } from 'react-native';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import IllustrationScreen from 'components/IllustrationScreen';

import FighterIllustration from 'assets/illustrations/onboarding2-fighter.png'; // eslint-disable-line import/extensions
import FanIllustration from 'assets/illustrations/onboarding2-fan.png'; // eslint-disable-line import/extensions

import { USER_TYPES } from 'resources/user/user.constants';

import styles from './styles';

const MAX_WIDTH_HEIGHT_PERCENT = 55;

function OnBoarding2({ route }) {
  const {
    userType,
  } = route?.params;

  const navigation = useNavigation();
  const { t } = useTranslation();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const height = screenHeight * MAX_WIDTH_HEIGHT_PERCENT / 100;

  const Illustration = userType === USER_TYPES.FAN ? FanIllustration : FighterIllustration;

  const onNext = useCallback(() => {
    navigation.navigate('OnBoarding3', { userType });
  }, [navigation, userType]);

  return (
    <IllustrationScreen
      contentStyles={styles.content}
      ilustrationContainerStyles={styles.ilustrationContainer}
      buttonText={t(`OnBoarding2.${userType}.buttonText`)}
      description={t(`OnBoarding2.${userType}.description`)}
      title={t(`OnBoarding2.${userType}.title`)}
      illustration={<Image source={Illustration} resizeMode="cover" style={{ width: screenWidth, height }} />}
      onButtonPress={onNext}
    />
  );
}

OnBoarding2.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      userType: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export default React.memo(OnBoarding2);
