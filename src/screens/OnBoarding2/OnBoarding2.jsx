import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import IllustrationScreen from 'components/IllustrationScreen';

import PlaceholderIllustration from 'assets/illustrations/placeholder';

function OnBoarding2({ route }) {
  const {
    userType,
  } = route?.params;

  const navigation = useNavigation();
  const { t } = useTranslation();

  const onNext = useCallback(() => {
    navigation.navigate('OnBoarding3', { userType });
  }, [navigation, userType]);

  return (
    <IllustrationScreen
      buttonText={t(`OnBoarding2.${userType}.buttonText`)}
      description={t(`OnBoarding2.${userType}.description`)}
      title={t(`OnBoarding2.${userType}.title`)}
      illustration={<PlaceholderIllustration />}
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
