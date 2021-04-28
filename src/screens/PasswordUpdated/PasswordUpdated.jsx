import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import IllustrationScreen from 'components/IllustrationScreen';

import PlaceholderIllustration from 'assets/illustrations/placeholder';

function PasswordUpdated() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const onNext = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{
        name: 'AppStack',
        state: {
          routes: [{ name: 'Account' }],
        },
      }],
    });
  }, [navigation]);

  return (
    <IllustrationScreen
      headerText={t('PasswordUpdated.security')}
      buttonText={t('PasswordUpdated.done')}
      description={t('PasswordUpdated.useYourNewPasswordToLogIn')}
      title={t('PasswordUpdated.passwordUpdated')}
      illustration={<PlaceholderIllustration />}
      onButtonPress={onNext}
    />
  );
}

export default PasswordUpdated;
