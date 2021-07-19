import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import IllustrationScreen from 'components/IllustrationScreen';

import UpdatedIllustration from 'assets/illustrations/verification-successful';

function ThanksForReporting({ route }) {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const {
    postId,
  } = route?.params;

  const onNext = useCallback(() => {
    navigation.navigate('Comments', { postId });
  }, [navigation, postId]);

  return (
    <IllustrationScreen
      headerText={t('ThanksForReporting.reportComment')}
      title={t('ThanksForReporting.thanksForReporting')}
      description={
        t('ThanksForReporting.thanksYourFeedback')
      }
      buttonText={t('ThanksForReporting.done')}
      illustration={<UpdatedIllustration />}
      onButtonPress={onNext}
    />
  );
}

ThanksForReporting.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      postId: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export default React.memo(ThanksForReporting);
