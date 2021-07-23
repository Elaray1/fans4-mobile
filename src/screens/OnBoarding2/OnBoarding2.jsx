import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import IllustrationScreen from 'components/IllustrationScreen';

import FighterIllustration from 'assets/illustrations/onboarding2-fighter';
import FanIllustration from 'assets/illustrations/onboarding2-fan';

import { USER_TYPES } from 'resources/user/user.constants';

import styles from './styles';

function OnBoarding2({ route }) {
  const {
    userType,
  } = route?.params;

  const navigation = useNavigation();
  const { t } = useTranslation();

  const Illustration = userType === USER_TYPES.FAN ? FanIllustration : FighterIllustration;

  const onNext = useCallback(() => {
    navigation.navigate('OnBoarding3', { userType });
  }, [navigation, userType]);

  return (
    <IllustrationScreen
      buttonText={t(`OnBoarding2.${userType}.buttonText`)}
      description={t(`OnBoarding2.${userType}.description`)}
      title={t(`OnBoarding2.${userType}.title`)}
      illustration={<Illustration style={styles.illustration} />}
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
