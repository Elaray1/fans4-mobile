import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import IllustrationScreen from 'components/IllustrationScreen';

import PlaceholderIllustration from 'assets/illustrations/placeholder';

import * as userApi from 'resources/user/user.api';

function OnBoarding3({ route }) {
  const {
    userType,
  } = route?.params;
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
      buttonText={t(`OnBoarding3.${userType}.buttonText`)}
      description={t(`OnBoarding3.${userType}.description`)}
      title={t(`OnBoarding3.${userType}.title`)}
      illustration={<PlaceholderIllustration />}
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
