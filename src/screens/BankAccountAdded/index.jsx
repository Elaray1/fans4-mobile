import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import IllustrationScreen from 'components/IllustrationScreen';

import UpdatedIllustration from 'assets/illustrations/verification-successful';

function BankAccountAdded() {
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
      headerText={t('BankAccountAdded.header')}
      buttonText={t('BankAccountAdded.linkText')}
      onButtonPress={onButtonPress}
      description={t('BankAccountAdded.description')}
      title={t('BankAccountAdded.title')}
      illustration={<UpdatedIllustration />}
    />
  );
}

export default React.memo(BankAccountAdded);
