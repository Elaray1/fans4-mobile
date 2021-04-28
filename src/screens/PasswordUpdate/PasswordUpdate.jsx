import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import IllustrationScreen from 'components/IllustrationScreen';

import PlaceholderIllustration from 'assets/illustrations/placeholder';

function PasswordUpdate() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const onLinkPress = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'SelectUserType',
        },
      ],
    });
  }, [navigation]);

  return (
    <IllustrationScreen
      linkText={t('PasswordUpdate.linkText')}
      onLinkPress={onLinkPress}
      description={t('PasswordUpdate.description')}
      title={t('PasswordUpdate.title')}
      illustration={<PlaceholderIllustration />}
    />
  );
}

export default React.memo(PasswordUpdate);
