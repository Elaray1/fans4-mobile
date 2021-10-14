import React from 'react';
import PropTypes from 'prop-types';
import { Image, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import * as userSelectors from 'resources/user/user.selectors';

import IllustrationScreen from 'components/IllustrationScreen';

import FighterIllustration from 'assets/illustrations/onboarding1-fighter.png'; // eslint-disable-line import/extensions
import FanIllustration from 'assets/illustrations/onboarding1-fan.png'; // eslint-disable-line import/extensions

import { USER_TYPES } from 'resources/user/user.constants';

import styles from './styles';

const MAX_WIDTH_HEIGHT_PERCENT = 55;

function OnBoarding1({ onNext, ...props }) {
  const { t } = useTranslation();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const height = screenHeight * MAX_WIDTH_HEIGHT_PERCENT / 100;

  const userType = useSelector(userSelectors.getUserType);

  const Illustration = userType === USER_TYPES.FAN ? FanIllustration : FighterIllustration;

  return (
    <IllustrationScreen
      contentStyles={styles.content}
      illustrationContainerStyles={styles.ilustrationContainer}
      buttonText={t(`OnBoarding1.${userType}.buttonText`)}
      description={t(`OnBoarding1.${userType}.description`)}
      title={t(`OnBoarding1.${userType}.title`)}
      illustration={<Image source={Illustration} resizeMode="cover" style={{ width: screenWidth, height }} />}
      onButtonPress={onNext}
      isIllustrationGradient
      {...props}
    />
  );
}

OnBoarding1.propTypes = {
  onNext: PropTypes.func,
};

OnBoarding1.defaultProps = {
  onNext: null,
};

export default React.memo(OnBoarding1);
