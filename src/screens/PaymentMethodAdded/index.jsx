import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import IllustrationScreen from 'components/IllustrationScreen';

import UpdatedIllustration from 'assets/illustrations/verification-successful';

function PaymentMethodAdded() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const onButtonPress = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'AppStack',
          state: {
            index: 1,
            routes: [
              {
                name: 'Account',
              },
              {
                name: 'Finances',
              },
            ],
          },
        },
      ],
    });
  }, [navigation]);

  return (
    <IllustrationScreen
      headerText={t('PaymentMethodAdded.header')}
      buttonText={t('PaymentMethodAdded.linkText')}
      onButtonPress={onButtonPress}
      description={t('PaymentMethodAdded.description')}
      title={t('PaymentMethodAdded.title')}
      illustration={<UpdatedIllustration />}
    />
  );
}

export default React.memo(PaymentMethodAdded);
