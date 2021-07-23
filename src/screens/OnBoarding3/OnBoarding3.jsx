import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';


import IllustrationScreen from 'components/IllustrationScreen';

import FighterIllustration from 'assets/illustrations/onboarding3-fighter';
import FanIllustration from 'assets/illustrations/onboarding3-fan';

import * as userApi from 'resources/user/user.api';
import { USER_TYPES } from 'resources/user/user.constants';
import * as userSelectors from 'resources/user/user.selectors';

import analyticsService from 'services/analytics.service';

import styles from './styles';

function OnBoarding3({ route }) {
  const {
    userType,
  } = route?.params;
  const { t } = useTranslation();
  const navigation = useNavigation();

  const userId = useSelector(userSelectors.getUserId);

  const Illustration = userType === USER_TYPES.FAN ? FanIllustration : FighterIllustration;

  const onNext = useCallback(async () => {
    navigation.reset({ routes: [{ name: 'AppStack', params: { screen: 'Account' } }] });

    try {
      await userApi.completeOnboarding();

      if (userType === USER_TYPES.FIGHTER) {
        analyticsService.logEvent({
          name: analyticsService.events.FIGHTER_ONBOARDING_COMPLETED,
          data: {
            userId,
          },
        });
      } else {
        analyticsService.logEvent({
          name: analyticsService.events.FAN_ONBOARDING_COMPLETED,
          data: {
            userId,
          },
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [navigation, userId, userType]);

  return (
    <IllustrationScreen
      buttonText={t(`OnBoarding3.${userType}.buttonText`)}
      description={t(`OnBoarding3.${userType}.description`)}
      title={t(`OnBoarding3.${userType}.title`)}
      illustration={<Illustration style={styles.illustration} />}
      onButtonPress={onNext}
    />
  );
}

OnBoarding3.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      userType: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export default React.memo(OnBoarding3);
