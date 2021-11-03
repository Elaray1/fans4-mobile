import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import IllustrationScreen from 'components/IllustrationScreen';

import UpdatedIllustration from 'assets/illustrations/verification-successful';

function FightWasSentToReview() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const onButtonPress = useCallback(() => {
    navigation.navigate('Tabs', {
      screen: 'Voting',
    });
  }, [navigation]);

  return (
    <IllustrationScreen
      buttonText={t('FightSentToReview.button')}
      onButtonPress={onButtonPress}
      description={t('FightSentToReview.description')}
      title={t('FightSentToReview.title')}
      illustration={<UpdatedIllustration />}
    />
  );
}

export default React.memo(FightWasSentToReview);
